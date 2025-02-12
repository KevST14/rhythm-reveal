/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      MONGODB_URI: process.env.MONGODB_URI,
    },
  };
  
  module.exports = nextConfig;
  