require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Successfully connected to MongoDB"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Spotify User Schema
const UserSchema = new mongoose.Schema({
  spotifyId: String,
  displayName: String,
  topTracks: Array,
});
const User = mongoose.model("User", UserSchema);

// Store User Data
app.post("/store-user", async (req, res) => {
  try {
    const { spotifyId, displayName, topTracks } = req.body;
    const user = await User.findOneAndUpdate(
      { spotifyId }, 
      { displayName, topTracks }, 
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to store user data" });
  }
});

// Use Dynamic Port (Defaults to 5001)
const PORT = process.env.PORT || 5001;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
