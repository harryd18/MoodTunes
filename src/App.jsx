import React ,{ useState } from 'react'
import MoodSelector from './MoodSelector'
import { playlists } from './playlistData'
import './App.css'


const moodColors = {
   happy: "bg-gradient-to-br from-yellow-200 via-yellow-100 to-white",
  sad: "bg-gradient-to-br from-blue-300 via-blue-100 to-white",
  chill: "bg-gradient-to-br from-green-200 via-green-100 to-white",
  angry: "bg-gradient-to-br from-red-300 via-red-100 to-white",
  energetic: "bg-gradient-to-br from-pink-300 via-pink-100 to-white",
};

function App(){

  const [selectedMood , setSelectedMood] = useState("");

  const handleMoodSelect= (mood) =>{
   setSelectedMood(mood);
}

  return(
    
    <div className= {`text-center p-6 min-h-screen transition-all duration-500 text-center px-4 sm:px-8 p-6 min-h-screen
    
    ${selectedMood ? moodColors[selectedMood] : "bg-white"}`}>
      <h1 className="text-3xl font-bold mb-4">Pick Your Mood 🎧</h1>
      <MoodSelector onSelect={handleMoodSelect}/>

      <button onClick={()=>{
        const moods = ["happy", "sad", "chill" , "angry", "energetic"];
        const random = moods[Math.floor(Math.random() * moods.length)];

        setSelectedMood(random);
        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-200"
      }}>

      Surprise Me 🎲

      </button>


   {selectedMood && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2 capitalize">
            {selectedMood} Playlist
          </h2>
          <ul className="max-w-md mx-auto text-left px-4 sm:px-0">
            {playlists[selectedMood].map((song, index) => (
              <li
                key={index}
                className="bg-gray-100 rounded-lg p-3 mb-2 shadow-sm transition-all duration-500 opacity-0 animate-fade-in"
              >
                <strong>{song.title}</strong> – {song.artist}
              </li>
            ))}
          </ul>

        <button  className ="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-200"  onClick={()=>{setSelectedMood("")}}>
            Reset Mood
        </button>
        </div>
      )}
    </div>
  )

}

export default App
