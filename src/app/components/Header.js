// components/Header.js
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';


const Header = () => {
const { data: session } = useSession();


return (
<header className="bg-spotifyGray p-4 flex justify-between items-center shadow-lg">
<h1 className="text-spotifyGreen text-2xl font-bold">Rhythm Reveal</h1>
<nav className="flex space-x-6 items-center">
<Link href="/" className="text-gray-200 hover:text-white">Home</Link>
<Link href="/playlists" className="text-gray-200 hover:text-white">Playlists</Link>
{session ? (
<button
onClick={() => signOut()}
className="text-gray-200 hover:text-white ml-4"
>
Logout
</button>
) : (
<button
onClick={() => signIn('spotify')}
className="text-gray-200 hover:text-white ml-4"
>
Login with Spotify
</button>
)}
</nav>
</header>
);

};


export default Header;


