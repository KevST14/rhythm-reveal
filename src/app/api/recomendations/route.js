import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) throw new Error("Missing access token");

    console.log("🔍 Received Access Token:", accessToken);

    // Fetch user's top artists from Spotify API
    const topArtistsResponse = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!topArtistsResponse.ok) {
      console.error("Failed to fetch top artists:", await topArtistsResponse.text());
      throw new Error("Failed to fetch top artists");
    }

    const topArtistsData = await topArtistsResponse.json();

    // Extract genres from top artists
    let genres = [...new Set(topArtistsData.items.flatMap(artist => artist.genres))].slice(0, 2);

    // Ensure at least one default genre if none are found
    if (genres.length === 0) {
      console.warn("⚠️ No genres found! Using default genres.");
      genres = ["pop"]; // Default genre
    }

    console.log("🎵 Extracted Genres:", genres);

    // Fetch recommendations from Spotify based on genres
    const recommendationsResponse = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_genres=${genres.join(",")}&limit=10`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!recommendationsResponse.ok) {
      console.error("Failed to fetch Spotify recommendations:", await recommendationsResponse.text());
      throw new Error("Failed to fetch Spotify recommendations");
    }

    const recommendationsData = await recommendationsResponse.json();

    // Extract relevant track information
    const recommendedTracks = recommendationsData.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      albumCover: track.album.images[0]?.url || "/default-cover.jpg",
      previewUrl: track.preview_url,
    }));

    console.log("Recommended Tracks:", recommendedTracks);

    return NextResponse.json({ recommendations: recommendedTracks });
  } catch (error) {
    console.error(" API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
