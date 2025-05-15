import React from "react";

function MoodSelector({onSelect}){

    const moods = [
        { label: "Happy", emoji: "😀", value: "happy" },
        { label: "Sad", emoji: "😢", value: "sad" },
        { label: "Chill", emoji: "😌", value: "chill" },
        { label: "Angry", emoji: "😡", value: "angry" },
        { label: "Energetic", emoji: "💃", value: "energetic" },
]

    return (
         <div className="flex justify-center gap-4 p-4">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onSelect(mood.value)}
          className="text-4xl hover:scale-125 transition-transform duration-300 ease-in-out hover:rotate-6 cursor-pointer"
        >
          {mood.emoji}
        </button>
      ))}
    </div>

    )
}

export default MoodSelector;