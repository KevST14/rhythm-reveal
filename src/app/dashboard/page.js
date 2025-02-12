"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Array of Spotify track IDs to rotate through
const trackIds = [
  "5TFD2bmFKGhoCRbX61nXY5", // Track 1 Bad Bunny
  "4204hwPYuToiuSunPFUoML", // Track 2 Wizkid
  "0JwfrZk5keNp3SYhZn6Wi1", // Track 3 Brent Faiyaz
  "2fXwCWkh6YG5zU1IyvQrbs", // Track 4 SZA
  "7fxEeYZRHYKOncVaQ8aDoy", // Track 5 Kendrick Lamar
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      fetch("/api/user-data", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setTopTracks(data.topTracks || []);
          setTopArtists(data.topArtists || []);
        });
    }
  }, [session]);

  // Function to get a random track ID while avoiding repeats
  useEffect(() => {
    const lastTrack = localStorage.getItem("lastPlayedTrack");
    let newTrack;

    do {
      newTrack = trackIds[Math.floor(Math.random() * trackIds.length)];
    } while (newTrack === lastTrack); // Ensure it's different from the last played track

    setCurrentTrack(newTrack);
    localStorage.setItem("lastPlayedTrack", newTrack); // Save for next session
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">🎵 Rhythm Reveal Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 rounded-lg shadow hover:bg-blue-500 transition" onClick={() => window.location.reload()}>
          Refresh Data 🔄
        </button>
      </div>

      {/* Rotating Spotify Featured Track Embed */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">🎶 Featured Track</h2>
        <iframe
          style={{ borderRadius: "12px" }}
          src={`https://open.spotify.com/embed/track/${currentTrack}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Tracks Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">🔥 Your Top Tracks</h2>
          <ul className="space-y-2">
            {topTracks.length > 0 ? (
              topTracks.map((track) => (
                <li key={track.id} className="flex items-center space-x-4 bg-gray-700 p-3 rounded-lg">
                  {/* Track Image */}
                  {track.album.images.length > 0 && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="w-12 h-12 rounded-lg"
                    />
                  )}
                  {/* Track Details */}
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-gray-400 text-sm">{track.artists.map((a) => a.name).join(", ")}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No top tracks available.</p>
            )}
          </ul>
        </div>

        {/* Top Artists Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">🎤 Your Top Artists</h2>
          <div className="grid grid-cols-3 gap-4">
            {topArtists.length > 0 ? (
              topArtists.map((artist) => (
                <div key={artist.id} className="text-center">
                  {/* Artist Image */}
                  {artist.images.length > 0 && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-16 h-16 rounded-full mx-auto"
                    />
                  )}
                  {/* Artist Name */}
                  <p className="text-sm mt-2">{artist.name}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No top artists available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
