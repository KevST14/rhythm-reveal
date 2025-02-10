export default function PlaylistCard({ track }) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{track.name}</h3>
          <p className="text-gray-400">{track.artists[0].name}</p>
        </div>
      </div>
    );
  }
  