import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { features } = await req.json();

    const response = await fetch("http://localhost:5001/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features }),
    });

    if (!response.ok) throw new Error("Failed to fetch recommendations");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
