import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const accessToken = event.queryStringParameters?.accessToken;
    if (!accessToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing access token" }),
      };
    }

    // Step 1: Fetch user's top artists from Spotify API
    const topArtistsResponse = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!topArtistsResponse.ok) throw new Error("Failed to fetch top artists");
    const topArtistsData = await topArtistsResponse.json();

    // Extract genres from top artists
    const genres = [...new Set(topArtistsData.items.flatMap(artist => artist.genres))].slice(0, 2);
    if (genres.length === 0) throw new Error("No genres found for recommendations");

    // Step 2: Fetch recommendations based on genres
    const recommendationsResponse = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_genres=${genres.join(",")}&limit=10`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!recommendationsResponse.ok) throw new Error("Failed to fetch Spotify recommendations");
    const recommendationsData = await recommendationsResponse.json();

    // Format recommendations
    const recommendedTracks = recommendationsData.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      albumCover: track.album.images[0]?.url || "/default-cover.jpg",
      previewUrl: track.preview_url,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ recommendations: recommendedTracks }),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
