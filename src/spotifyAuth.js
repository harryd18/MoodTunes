
export async function exchangeToken(code) {
  const CLIENT_ID = "5ffa53f5536f4675bbfa3efc546eb7d9";
  const REDIRECT_URI = "https://mood-tunes-ten.vercel.app/";
  const verifier = localStorage.getItem("verifier");

  if (!verifier) {
    throw new Error("Missing PKCE code verifier in localStorage");
  }

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("code_verifier", verifier);

  console.log("Exchanging code:", code);
  console.log("Using verifier:", verifier);


  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || "Token exchange failed");
    }

    return data.access_token;
  } catch (err) {
    console.error("Token exchange error:", err);
    throw err;
  }
}

export async function fetchPlaylistsByMood(mood, token) {
  const query = encodeURIComponent(mood);
  const url = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=5`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch playlists");
    }

    return data.playlists.items
    .filter(item => item && item.name && item.external_urls?.spotify)
    .map(item => ({
    name: item.name,
    url: item.external_urls.spotify,
    image: item.images?.[0]?.url || null, // Safely handle missing images
  }));

  } catch (err) {
    console.error("Error fetching playlists by mood:", err);
    return [];
  }
}
