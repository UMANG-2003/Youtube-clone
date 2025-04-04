import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  dotenv.config();
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
    });
    console.log("MongoDB connected successfully");
  }
  catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
  
}
export default connectDB;
