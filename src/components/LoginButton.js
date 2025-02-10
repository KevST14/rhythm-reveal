import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  return (
    <button onClick={session ? () => signOut() : () => signIn("spotify")}>
      {session ? "Logout" : "Login with Spotify"}
    </button>
  );
}
