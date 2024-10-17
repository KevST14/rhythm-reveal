// components/Profile.js

export default function Profile({ user }) {
    return (
    <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-800 rounded-lg shadow-lg">
    <img
    src={user.image || "https://via.placeholder.com/100"}
    alt={user.name}
    className="w-16 h-16 rounded-full object-cover"
    />
    <div>
    <h1 className="text-2xl font-semibold text-white">{user.name}</h1>
    <p className="text-gray-400">{user.email}</p>
    </div>
    </div>
    );
    }
    