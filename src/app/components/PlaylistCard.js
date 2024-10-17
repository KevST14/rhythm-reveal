// components/PlaylistCard.js
export default function PlaylistCard({ playlist }) {
    // Use the first image from playlists or the album image from tracks
    const imageUrl = playlist.images && playlist.images.length > 0
    ? playlist.images[0].url
    : playlist.album?.images[0]?.url || "https://via.placeholder.com/300"; // Fallback to placeholder
    return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out">
    <img
    src={imageUrl}
    alt={playlist.name || playlist.title} // Use the title for tracks
    className="w-full h-48 object-cover"
    />
    <div className="p-4">
    <h3 className="text-xl font-semibold text-white mb-2">{playlist.name || playlist.title}</h3>
    <p className="text-gray-400">{playlist.description || playlist.artists?.map(artist => artist.name).join(", ")}</p>
    </div>
    </div>
    );
    }
    