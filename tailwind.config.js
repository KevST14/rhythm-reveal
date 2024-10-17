// tailwind.config.js
module.exports = {
content: [
"./app/**/*.{js,ts,jsx,tsx}",
"./components/**/*.{js,ts,jsx,tsx}",
"./src/**/*.{js,ts,jsx,tsx}", // Add this line
],
theme: {
extend: {
colors: {
spotifyGreen: "#1DB954",
spotifyBlack: "#191414",
},
},
},
plugins: [],
};
