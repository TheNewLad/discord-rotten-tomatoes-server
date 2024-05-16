import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  supabaseId: { type: String, required: true, unique: true, index: true },
  discordId: { type: String, required: true, unique: true },
  reviewWeights: { type: Map, required: true, of: Number },
});

export const User = mongoose.model("User", userSchema);
