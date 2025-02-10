export default function ArtistCard({ artist }) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold">{artist.name}</h3>
      </div>
    );
  }
  