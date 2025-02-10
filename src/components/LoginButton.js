"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard"); // Redirect only after component has mounted
    }
  }, [session, router]);

  if (session) {
    return null; // Prevent button from showing after login
  }

  return (
    <button onClick={() => signIn("spotify")} className="px-4 py-2 bg-green-500 text-white rounded-lg">
      Sign in with Spotify
    </button>
  );
}
