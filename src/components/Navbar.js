"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 w-full shadow-lg z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">🎵 Rhythm Reveal</h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/dashboard" className="hover:text-blue-400">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/insights" className="hover:text-blue-400">
              Insights
            </Link>
          </li>
          <li>
            <Link href="/dashboard/recommendations" className="hover:text-blue-400">
              AI Recommendations
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
