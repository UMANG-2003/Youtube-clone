import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const  verifyJWT=asyncHandler(async (req,res,next)=>{
    try{

        const token =req.cookies?.accessToken || req.header 
        ("Authorization")?.replace("Bearer ","")
        if(!token){
          throw new ApiError(401,"access token is required")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      
        const user = await User.findById(decodedToken.id).select("-password -refreshToken")
      
        if(!user){
          throw new ApiError(401,"user doesn't exist")
        }
        req.user=user
        next()
    }catch(err){
        throw new ApiError(401,"invalid access token")
    }


})