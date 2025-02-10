import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Rhythm Reveal</h1>
      <p className="text-lg mt-2">Log in to see your personalised Spotify analytics</p>
      <LoginButton />
    </div>
  );
}
