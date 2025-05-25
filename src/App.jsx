import React, { useEffect, useState } from 'react';
import MoodSelector from './MoodSelector';
import './App.css';
import { generateCodeVerifier, generateCodeChallenge } from './pkceUtils';
import { exchangeToken, fetchPlaylistsByMood } from './spotifyAuth';

const CLIENT_ID = "5ffa53f5536f4675bbfa3efc546eb7d9";
const REDIRECT_URI = "https://mood-tunes-ten.vercel.app/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

const moodColors = {
  happy: "bg-gradient-to-br from-yellow-200 via-yellow-100 to-white",
  sad: "bg-gradient-to-br from-blue-300 via-blue-100 to-white",
  chill: "bg-gradient-to-br from-green-200 via-green-100 to-white",
  angry: "bg-gradient-to-br from-red-300 via-red-100 to-white",
  energetic: "bg-gradient-to-br from-pink-300 via-pink-100 to-white",
};

//Translating a mood into a single keyword that Spotify API can understand.
const moodKeywords = {
      happy: "happy vibes",
      sad: "sad songs",
      chill: "chill lofi",
      angry: "rock metal",
      energetic: "workout hits"

}

function App() {
  const [selectedMood, setSelectedMood] = useState("");
  const [token, setToken] = useState("");
  const [playlists , setPlaylists] = useState([]);

  const handleMoodSelect = async (mood) => {
  setSelectedMood(mood);
  setPlaylists([]); // Clear previous mood's playlists

  const keyword = moodKeywords[mood] || mood;

  if (token) {
    const fetchedPlaylists = await fetchPlaylistsByMood(keyword, token);
    setPlaylists(fetchedPlaylists);
  }
};



  // Spotify Login Flow
  const handleSpotifyLogin = async () => {
    
    let verifier = localStorage.getItem("verifier");

    if(!verifier){
      verifier = generateCodeVerifier();
      localStorage.setItem("verifier",verifier);
    }

    const challenge = await generateCodeChallenge(verifier);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      code_challenge_method: "S256",
      code_challenge: challenge,
      scope: "user-read-private user-read-email playlist-read-private"
    });

    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
  };

// Detect redirect back with code and exchange it

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    setToken(storedToken);

    //  fetch profile
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User Profile (existing token):", data);
      });

    return; // Exit early
  }

  if (code) {
    const fetchToken = async () => {
      try {
        const accessToken = await exchangeToken(code);
        localStorage.setItem("token", accessToken);
        setToken(accessToken);

        // Clean up: remove code from URL so it's not reused
        window.history.replaceState({}, document.title, "/");

        // fetch user data after fresh login
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        console.log("User Profile (fresh login):", data);
      } catch (err) {
        console.error("Token exchange failed:", err.message);
      }
    };

    fetchToken();
  }
}, []);





  return (
    <div className={`text-center p-6 min-h-screen transition-all duration-500 text-center px-4 sm:px-8
      ${selectedMood ? moodColors[selectedMood] : "bg-white"}`}>
   <div className="flex justify-center mb-4">
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 border border-red-300 rounded-full hover:bg-red-200 hover:text-red-800 transition duration-200 shadow-sm"
      >
        🔁 Reset Everything
      </button>
    </div>


      {!token ? (
        <button
          onClick={handleSpotifyLogin}
          className="px-4 py-2 mb-4 inline-block bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Login with Spotify
        </button>
      ) : (
        <p className="text-sm text-gray-500 mb-4">Logged in to Spotify</p>
      )}

      <h1 className="text-3xl font-bold mb-4">Pick Your Mood 🎷</h1>
      <MoodSelector onSelect={handleMoodSelect} />

      <button
        onClick={() => {
          const moods = ["happy", "sad", "chill", "angry", "energetic"];
          const random = moods[Math.floor(Math.random() * moods.length)];
          handleMoodSelect(random);;
        }}
        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-200"
      >
        Surprise Me 🎲
      </button>

      {selectedMood && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2 capitalize">
            {selectedMood} Playlist
          </h2>
          <ul className="max-w-md mx-auto text-left px-4 sm:px-0">
  {playlists.map((playlist, index) => (
    <li key={index} className="bg-gray-100 rounded-lg p-3 mb-2 shadow-sm transition-all duration-500 opacity-0 animate-fade-in flex items-center gap-4">
     {playlist.image ? (
      <img
        src={playlist.image}
        alt={playlist.name}
        className="w-12 h-12 rounded object-cover"
      />
    ) : (
      <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
        No Image
      </div>
    )}
      <a
        href={playlist.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-indigo-700 hover:underline"
      >
        {playlist.name}
      </a>
          </li>
        ))}
      </ul>

          <button
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-200"
            onClick={() => setSelectedMood("")}
          >
            Reset Mood
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
