//api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";


const handler = NextAuth({
providers: [
SpotifyProvider({
clientId: process.env.SPOTIFY_CLIENT_ID,
clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read,user-read-recently-played,user-read-playback-state,user-modify-playback-state",
}),
],
callbacks: {
async jwt({ token, account }) {
if (account) {
token.accessToken = account.access_token;
}
return token;
},
async session({ session, token }) {
session.accessToken = token.accessToken;
return session;
},
},
});


export { handler as GET, handler as POST };