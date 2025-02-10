"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>

      <h2 className="text-2xl mt-5">Your Top Tracks:</h2>
      <ul>
        {topTracks.map((track) => (
          <li key={track.id}>{track.name} - {track.artists[0].name}</li>
        ))}
      </ul>

      <h2 className="text-2xl mt-5">Your Top Artists:</h2>
      <ul>
        {topArtists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}
