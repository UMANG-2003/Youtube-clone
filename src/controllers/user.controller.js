import asyncHandler from '../utils/asyncHandler.js';



const registerUser = asyncHandler(async (_, res) => {
  res.status(200).json({message: 'User registered successfully'});
  console.log("done")
});

export {registerUser};