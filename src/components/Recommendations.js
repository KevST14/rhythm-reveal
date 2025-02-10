"use client";
import { useState, useEffect } from "react";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getRecommendation() {
    setLoading(true);
    setError("");

    try {
      // Fetch user data (top tracks) from Spotify
      const userDataResponse = await fetch("/api/user-data");
      const userData = await userDataResponse.json();

      if (!userData.topTracks || userData.topTracks.length === 0) {
        throw new Error("No listening data found.");
      }

      // Extract track features from user's top tracks
      const trackIds = userData.topTracks.slice(0, 5).map(track => track.id); // Top 5 tracks
      const featuresResponse = await fetch(`/api/track-features?ids=${trackIds.join(",")}`);
      const trackFeatures = await featuresResponse.json();

      if (!trackFeatures || !trackFeatures.audio_features) {
        throw new Error("Failed to fetch track features.");
      }

      // Send extracted features to AI model for recommendations
      const aiResponse = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: trackFeatures.audio_features }),
      });

      const aiData = await aiResponse.json();
      setRecommendations(aiData.recommendedTracks || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow text-white">
      <h2 className="text-2xl font-bold mb-4">🎧 AI-Powered Recommendations</h2>

      <button
        onClick={getRecommendation}
        className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded text-white"
        disabled={loading}
      >
        {loading ? "Generating..." : "Get AI Recommendations"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((track) => (
          <div key={track.id} className="bg-gray-700 p-4 rounded-lg shadow">
            <img src={track.albumImage} alt={track.name} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="mt-2 font-semibold">{track.name}</h3>
            <p className="text-gray-400">{track.artist}</p>
            <audio controls className="w-full mt-2">
              <source src={track.previewUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
