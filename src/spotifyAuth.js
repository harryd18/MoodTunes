
export async function exchangeToken(code) {
  const CLIENT_ID = "5ffa53f5536f4675bbfa3efc546eb7d9";
  const REDIRECT_URI = "http://127.0.0.1:5173/";
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
