"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Insights() {
  const { data: session } = useSession();
  const [topGenres, setTopGenres] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [weeklyTrends, setWeeklyTrends] = useState([]);

  useEffect(() => {
    if (session?.accessToken) {
      fetch("/api/insights", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setTopGenres(data.topGenres || []);
          setTopArtists(data.topArtists || []);
          setWeeklyTrends(data.weeklyTrends || []);
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
        <h1 className="text-3xl font-semibold">📊 Your Listening Insights</h1>
        <button className="px-4 py-2 bg-blue-600 rounded-lg shadow hover:bg-blue-500 transition">
          Refresh Data 🔄
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Genres Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">🎶 Your Top Genres</h2>
          <ul className="space-y-2">
            {topGenres.length > 0 ? (
              topGenres.map((genre, index) => (
                <li key={index} className="bg-gray-700 p-3 rounded-lg text-center">
                  {genre}
                </li>
              ))
            ) : (
              <p className="text-gray-400">No genre data available.</p>
            )}
          </ul>
        </div>

        {/* Top Artists Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">🎤 Your Top Artists</h2>
          <div className="grid grid-cols-3 gap-4">
            {topArtists.length > 0 ? (
              topArtists.map((artist, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm mt-2">{artist}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No top artists available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Trends Chart */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mt-6">
        <h2 className="text-2xl font-semibold mb-4">📈 Weekly Listening Trends</h2>
        {weeklyTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrends.map((plays, index) => ({ day: `Day ${index + 1}`, plays }))}>
              <XAxis dataKey="day" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Bar dataKey="plays" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">No trend data available.</p>
        )}
      </div>
    </div>
  );
}
