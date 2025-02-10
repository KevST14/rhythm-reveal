"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data: session } = useSession();
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

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
        <button className="px-4 py-2 bg-blue-600 rounded-lg shadow hover:bg-blue-500 transition">
          Refresh Data 🔄
        </button>
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
                    <p className="text-gray-400 text-sm">{track.artists.map(a => a.name).join(", ")}</p>
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
