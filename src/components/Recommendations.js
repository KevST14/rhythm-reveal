"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Recommendations() {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  async function getRecommendation() {
    try {
      if (!session?.accessToken) {
        setError("User not authenticated with Spotify");
        console.error("⚠️ No access token found in session.");
        return;
      }

      console.log("📡 Sending request with token:", session.accessToken);

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: session.accessToken }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      console.log("AI Recommendations Response:", data);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Recommendation Fetch Error:", err.message);
      setError(err.message);
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={getRecommendation}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Get AI Recommendations
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {recommendations.length > 0 ? (
          recommendations.map((track) => (
            <div key={track.id} className="bg-gray-800 p-4 rounded-lg shadow">
              <img src={track.albumCover} alt={track.name} className="w-full h-40 object-cover rounded" />
              <p className="mt-2 font-semibold">{track.name}</p>
              <p className="text-gray-400">{track.artist}</p>
              {track.previewUrl && (
                <audio controls className="mt-2 w-full">
                  <source src={track.previewUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-4">No recommendations available.</p>
        )}
      </div>
    </div>
  );
}
