import mongoose from "mongoose";

const UserInsightsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  topGenres: { type: [String], default: [] },
  topArtists: { type: [String], default: [] },
  weeklyTrends: { type: [Number], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserInsights || mongoose.model("UserInsights", UserInsightsSchema);
