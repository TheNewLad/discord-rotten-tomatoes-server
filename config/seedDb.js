import mongoose from "mongoose";
import { env } from "../config.js";
import { User } from "../models/User.js";

const seedUsers = [
  {
    discordUserId: "discord1",
    supabaseUserId: "supabase1",
  },
  {
    discordUserId: "discord2",
    supabaseUserId: "supabase2",
  },
];

async function seedDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Clear existing data
    const userIDsToDelete = seedUsers.map((user) => user.supabaseUserId);
    const query = { supabaseUserId: { $in: userIDsToDelete } };
    await User.deleteMany(query);
    console.log("Cleared existing users");

    // Insert seed data
    await User.insertMany(seedUsers);
    console.log("Seed data inserted");

    // Close the connection
    mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error seeding the database", error);
  }
}

seedDB();
