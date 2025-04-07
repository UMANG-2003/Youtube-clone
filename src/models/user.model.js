import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowrecase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowrecase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    indxe: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  watchHistory: {
    type: Schema.Types.ObjectId,
    ref: "video",
  },
  password:{
    type:String,
    required:[true,"Password is required"]
  },
  refreshToken:{
    type:String,
  },
  timestamps: true,
  
});
