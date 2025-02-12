import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb"; // Ensure this exists
import UserInsights from "@/models/UserInsights"; // Ensure this schema exists
import fetchSpotifyInsights from "@/utils/fetchSpotifyInsights"; // Helper function for fetching fresh data

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB(); // Ensure MongoDB connection

    // Retrieve cached insights for the user
    const cachedInsights = await UserInsights.findOne({ email: session.user.email });

    if (cachedInsights && cachedInsights.updatedAt > Date.now() - 24 * 60 * 60 * 1000) {
      console.log("Returning cached insights");
      return NextResponse.json(cachedInsights);
    }

    // Fetch new data from Spotify API
    console.log("Fetching fresh insights from Spotify API...");
    const newInsights = await fetchSpotifyInsights(session.accessToken);

    // Update MongoDB with new insights
    await UserInsights.findOneAndUpdate(
      { email: session.user.email },
      { ...newInsights, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    return NextResponse.json(newInsights);
  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}
