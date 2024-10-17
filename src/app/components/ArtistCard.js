// app/components/ArtistCard.js

export default function ArtistCard({ artist }) {
    return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out">
    <img
    src={artist.images[0]?.url || "https://via.placeholder.com/300"}
    alt={artist.name}
    className="w-full h-48 object-cover"
    />
    <div className="p-4">
    <h3 className="text-xl font-semibold text-white mb-2">{artist.name}</h3>
    <p className="text-gray-400">{artist.followers.total.toLocaleString()} Followers</p>
    </div>
    </div>
    );
    }
    