// app/page.js
"use client";


import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar"; // Import Navbar
import Profile from "./components/Profile";
import PlaylistCard from "./components/PlaylistCard";
import ArtistCard from "./components/ArtistCard";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function Home() {
const { data: session, status } = useSession();
const [playlists, setPlaylists] = useState([]);
const [topTracks, setTopTracks] = useState([]);
const [topArtists, setTopArtists] = useState([]);
const [trackData, setTrackData] = useState({
labels: [],
datasets: [{
label: 'Popularity (0-100)',
data: [],
backgroundColor: 'rgba(29, 185, 84, 0.6)',
}],
});


const [artistData, setArtistData] = useState({
labels: [],
datasets: [{
label: 'Followers',
data: [],
backgroundColor: 'rgba(29, 185, 84, 0.6)',
}],
});


useEffect(() => {
if (session) {
const fetchData = async () => {
try {
const playlistRes = await axios.get("https://api.spotify.com/v1/me/playlists", {
headers: { Authorization: `Bearer ${session.accessToken}` },
});
const topTracksRes = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
headers: { Authorization: `Bearer ${session.accessToken}` },
});
const topArtistsRes = await axios.get("https://api.spotify.com/v1/me/top/artists", {
headers: { Authorization: `Bearer ${session.accessToken}` },
});


setPlaylists(playlistRes.data.items);
setTopTracks(topTracksRes.data.items);
setTopArtists(topArtistsRes.data.items);


// Prepare data for top tracks visualization
const trackLabels = topTracksRes.data.items.map(track => track.name);
const trackPopularity = topTracksRes.data.items.map(track => track.popularity);
setTrackData({
labels: trackLabels,
datasets: [{ ...trackData.datasets[0], data: trackPopularity }],
});


// Prepare data for top artists visualization
const artistLabels = topArtistsRes.data.items.map(artist => artist.name);
const artistFollowers = topArtistsRes.data.items.map(artist => artist.followers.total);
setArtistData({
labels: artistLabels,
datasets: [{ ...artistData.datasets[0], data: artistFollowers }],
});


} catch (err) {
console.error("Error fetching Spotify data", err);
}
};


fetchData();
}
}, [session]);


if (status === "loading") {
return <div className="flex items-center justify-center h-screen">Loading...</div>;
}


return (
<main className="p-4 bg-spotifyBlack text-white min-h-screen">
<Navbar /> {/* Include the Navbar here */}
<div className="max-w-5xl mx-auto">
{session ? (
<>
<Profile user={session.user} />
<section id="playlists" className="mt-8">
<h2 className="text-3xl font-bold mb-4">Your Playlists</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
{playlists.map((playlist) => (
<PlaylistCard key={playlist.id} playlist={playlist} />
))}
</div>
</section>
<section id="top-tracks" className="mt-8">
<h2 className="text-3xl font-bold mb-4">Top Tracks</h2>
<Bar
data={trackData}
options={{
responsive: true,
plugins: {
legend: {
display: true,
position: 'top',
},
tooltip: {
callbacks: {
label: function(tooltipItem) {
return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Show label with value
}
}
}
}
}}
/>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
{topTracks.map((track) => (
<PlaylistCard key={track.id} playlist={track} />
))}
</div>
</section>
<section id="top-artists" className="mt-8">
<h2 className="text-3xl font-bold mb-4">Top Artists</h2>
<Bar
data={artistData}
options={{
responsive: true,
plugins: {
legend: {
display: true,
position: 'top',
},
tooltip: {
callbacks: {
label: function(tooltipItem) {
return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Show label with value
}
}
}
}
}}
/>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
{topArtists.map((artist) => (
<ArtistCard key={artist.id} artist={artist} />
))}
</div>
</section>
</>
) : (
<div className="text-center">
<button
onClick={() => signIn("spotify")}
className="text-spotifyGreen border border-spotifyGreen px-4 py-2 rounded"
>
Log in with Spotify
</button>
</div>
)}
</div>
</main>
);
}


