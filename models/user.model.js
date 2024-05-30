import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  reviewWeights: { type: Map, of: Number },
});

export const UserModel = mongoose.model("UserModel", userSchema);
