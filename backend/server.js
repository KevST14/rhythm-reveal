require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const puppeteer = require("puppeteer");
const tf = require("@tensorflow/tfjs-node");

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

// Load the AI Model
let model;
(async () => {
  try {
    model = await tf.loadLayersModel("file://./ai-model/model.json");
    console.log("AI model loaded successfully");
  } catch (error) {
    console.error("Error loading AI model:", error);
  }
})();

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

// AI-Powered Song Recommendations
app.post("/recommendations", async (req, res) => {
  try {
    if (!model) return res.status(500).json({ error: "AI model not loaded yet" });

    const { features } = req.body; // Expecting song feature array: [tempo, energy, danceability]
    
    // Convert input to tensor
    const inputTensor = tf.tensor2d([features]);

    // Predict recommendation score
    const prediction = model.predict(inputTensor);
    const score = (await prediction.data())[0];

    res.json({ recommendationScore: score });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Generate User Report (Spotify Wrapped-style)
app.get("/generate-report/:spotifyId", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");
    await page.pdf({ path: "report.pdf", format: "A4" });
    await browser.close();
    res.download("report.pdf");
  } catch (error) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// Use Dynamic Port (Defaults to 5001)
const PORT = process.env.PORT || 5001;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
