import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { features } = await req.json();
    console.log("Sending features to AI:", features);

    const response = await fetch("http://localhost:5001/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features }),
    });

    console.log("Flask API Response Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from AI API:", errorText);
      throw new Error(`Failed to fetch recommendations: ${errorText}`);
    }

    const data = await response.json();
    console.log("AI Recommendations:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
