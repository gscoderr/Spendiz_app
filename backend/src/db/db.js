import mongoose from "mongoose";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { DB_NAME } from "../constants.js";

dotenv.config();

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
