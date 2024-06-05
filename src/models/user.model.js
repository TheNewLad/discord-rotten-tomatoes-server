import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  reviewWeights: { type: Map, of: Number },
});

export const UserModel = mongoose.model("User", userSchema);
