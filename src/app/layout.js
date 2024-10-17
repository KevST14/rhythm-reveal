// app/layout.js
"use client";
import { SessionProvider } from 'next-auth/react';
import './globals.css'; // Ensure this line imports Tailwind CSS


export default function RootLayout({ children }) {
return (
<SessionProvider>
<html lang="en">
<body className="bg-spotifyBlack text-white">
{children}
</body>
</html>
</SessionProvider>
);
}
