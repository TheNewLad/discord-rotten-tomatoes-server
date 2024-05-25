import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  supabaseUserId: { type: String, required: true, unique: true, index: true },
  discordUserId: { type: String, required: true, unique: true },
  reviewWeights: { type: Map, of: Number },
  onboarded: { type: Boolean, default: false },
});

export const User = mongoose.model("User", userSchema);
