import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import {uploadCloudinary} from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens=async(userId)=>{
  try{
      const user=await User.findById(userId)
      const accessToken=user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()
      user.refreshToken=refreshToken
      await user.save({validateBeforeSave:false})
      return {accessToken,refreshToken}

  } catch(error){
        throw new ApiError(500,"Something went wrong in tokens")
  }
  
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Full name is required");
  }

  const userExisted =await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExisted) {
    throw new ApiError(400, "User already existed");
  }
  // console.log("FILES RECEIVED: ", req.files);
  // console.log("AVATAR PATH: ", req.files?.avatar?.[0]?.path);
  
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }
  
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing in the request");
  }
 
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const userObj = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(userObj._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "user registory error");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "successfully registered"));
});

const loginUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if (!username || !email){
      throw new ApiError (400,"username or password is required")
    }

    const user=await User.findOne({
      $or :[{username},{email}]
    })

    if(!user){
      throw new ApiError(404 ,"user doesn't exist")
    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
      throw new ApiError(401,"incorrect password")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options={
      httpOnly:true,
      secure:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
        200,{
          user:loggedInUser,accessToken,refreshToken
        },
        "user logged in successfully"
      )
    )


})

const logoutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,{
    $set:{
      refresh:undefined
    }
  },
  {
    new:true,
  }
)

const options={
  httpOnly:true,
  secure:true
}
 return res 
 .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, null, "user logged out successfully"))


})





export { registerUser,loginUser,logoutUser };
