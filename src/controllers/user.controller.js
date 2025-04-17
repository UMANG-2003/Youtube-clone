import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import uploadCloudinary from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Full name is required");
  }

  const userExisted = User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExisted) {
    throw new ApiError(409, "User already existed");
  }

  const avatarLP = req.files?.avatar[0]?.path || null;
  const coverImageLP = req.files?.coverImage[0]?.path || null;

  if(!avatarLP){
    throw new ApiError(400, "Avatar is required");
  }
  const avatar=await uploadCloudinary(avatarLP)
  const coverImage=await uploadCloudinary(coverImageLP)

  if(!avatar){
   throw new ApiError(400, "Avatar is required");
  }

   const userObj=await User.create({
   fullName,
   avatar:avatar.url,
   coverImage:coverImage?.url || "",
   email,
   password,
   username:username.toLowerCase(),

  })
  const createdUser=await User.findById(userObj._id).select("-password -refreshToken")
  if(!createdUser){
   throw new ApiError(500 ,"user registory error")
  }

  return res.status(201).json(
   new ApiResponse(200,createdUser,"successfully registered")
  )
});

export { registerUser };
