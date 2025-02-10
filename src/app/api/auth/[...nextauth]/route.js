import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing environment variables. Ensure SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and NEXTAUTH_SECRET are set.");
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read,user-read-recently-played,playlist-read-private,user-read-playback-state",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at * 1000; // Convert expires_at to milliseconds
      }

      // Refresh the access token if it has expired
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Refreshes the Spotify access token when expired
 */
async function refreshAccessToken(token) {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const refreshedTokens = await response.json();
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing Spotify access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
