"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    // Redirect to the dashboard after login
    router.push("/dashboard");
    return null; // Prevents button flickering
  }

  return (
    <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>
  );
}
