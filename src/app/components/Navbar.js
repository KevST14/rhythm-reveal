// app/components/Navbar.js
import Link from 'next/link';


const Navbar = () => {
return (
<nav className="bg-gray-800 p-4">
<div className="max-w-5xl mx-auto flex justify-between items-center">
<h1 className="text-white text-2xl">Rhythm Reveal</h1>
<div className="space-x-4">
<Link href="/" className="text-gray-300 hover:text-white">
Home
</Link>
<Link href="#playlists" className="text-gray-300 hover:text-white">
Playlists
</Link>
<Link href="#top-tracks" className="text-gray-300 hover:text-white">
Top Tracks
</Link>
<Link href="#top-artists" className="text-gray-300 hover:text-white">
Top Artists
</Link>
</div>
</div>
</nav>
);
};


export default Navbar;


