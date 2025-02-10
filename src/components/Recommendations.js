"use client";
import { useState } from "react";

export default function Recommendations() {
  const [score, setScore] = useState(null);

  async function getRecommendation() {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [120, 0.8, 0.9] }),
    });

    const data = await response.json();
    setScore(data.recommendationScore);
  }

  return (
    <div className="p-6">
      <button
        onClick={getRecommendation}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Get AI Recommendation
      </button>

      {score !== null && <p>AI Score: {score.toFixed(2)}</p>}
    </div>
  );
}
