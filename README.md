# MoodTunes 🎵

MoodTunes is a mood-based playlist generator that connects to my Spotify account and fetches real playlists depending on how the user is feeling. I created this as a personal front-end project using React and the Spotify API.

## Features

- Login with Spotify using Authorization Code Flow with PKCE
- Choose your current mood (Happy, Sad, Chill, Angry, Energetic)
- Fetches real public playlists from Spotify based on the selected mood
- Smooth UI with background color transitions based on emotion
- Fully responsive and deployed with Vercel

## Tech Stack

- React (with Vite)
- Tailwind CSS for styling
- Spotify Web API
- PKCE authentication flow
- Vercel for deployment

## How it Works

When the user log in using Spotify, the app securely fetches an access token using the PKCE flow. Then, based on the mood user selects, the app makes a call to Spotify’s Search API with relevant keywords and shows the top 5 matching playlists. Each playlist links directly to Spotify.

## Live Demo

You can try it out here:  
👉 

## Getting Started Locally

```bash
git clone https://github.com/harryd18/MoodTunes.git
cd MoodTunes
npm install
npm run dev
```

## Author

Harshit Dhasmana  
- Email : [dharshit2001@gmail.com](mailto:dharshit2001@gmail.com) 
- Visit my LinkedIn : [LinkedIn](https://www.linkedin.com/in/harshit-dhasmana-15b9342bb)  
- Visit my Github : [GitHub](https://github.com/harryd18/MoodTunes)

