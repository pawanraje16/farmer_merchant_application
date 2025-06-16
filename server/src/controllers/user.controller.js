import { User } from "../models/user.model.js";
import { ApiError  } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const generateAccessAndRefreshTokens = async(userId) => {

   try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}
    

   } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
   }
}

const registerUser = asyncHandler ( async (req, res) => {
   console.log("Received body: ", req.body);
  console.log("Received files: ", req.files);

//   const {
//     fullName,
//     contact,
//     username,
//     email,
//     adharNo,
//     userType,
//     password,
//     confirmPassword
//   } = req.body;

   const {fullName, contact, username, email, adharNo, userType, password, confirmPassword} = req.body
   console.log("email: ",email)
   if(password!=confirmPassword){
      throw new ApiError(400, "password and confirmedpassword must be equal")
   }
   if([fullName, contact, username, email, adharNo, userType, password, confirmPassword].some((field) => field?.trim() === "")){
      throw new ApiError(400, "All fields are required")
   }
   
   const existedUser = await User.findOne({
      $or: [{ username }, { email }, { adharNo }]
   })

   if(existedUser){
      throw new ApiError(409, "User with email or username or AdharNO already exists")
   }
   console.log(req.files);

   const avatarLocalPath = req.files?.avatar[0]?.path;

   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar file is required")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar) {
      throw new ApiError(400, "Avatar file is required")
   }

   const user = await User.create({
      fullName,
      avatar: avatar.url,
      email,
      password,
      username: username.toLowerCase(),
      adharNo,
      contact,
      userType
   })

   const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
      throw new ApiError(500, "Something went wrong while registering the user")
   }

 return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
 )
   
} )

const loginUser = asyncHandler(async (req, res) => {
   const {email, username, password} = req.body

   if(!(username || email)){
      throw new ApiError(400, "username or mail is required")
   }

   const user = await User.findOne({
      $or: [{username}, {email}]
   })

   if(!user){
      throw new ApiError (404, "User does not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password);

   if(!isPasswordValid){
      throw new ApiError(401, "Invalid user credentials")
   }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
      httpOnly: true, // bydefault anyone modify the cookie after httponly making true only server will able to modify the cookies
      secure: true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken",refreshToken, options)
   .json(
      new ApiResponse(
         200,
         {
            user: loggedInUser, accessToken, refreshToken
         },
         "User logged In Successfully"
      )
   )
})

const logoutUser = asyncHandler (async(req, res) => {
   await User.findByIdAndUpdate(req.user._id,
      {
         $unset: {
            refreshToken: 1
         }
      },
      {
         new: true
      }
   )

   const options = {
      httpOnly: true,
      secure: true
   }

   return res 
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken) {
      throw new ApiError(401, "unathorized request")
   }

   try {
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
      )
     
      const user = await User.findById(decodedToken?._id)

      if(!user) {
         throw new ApiError(401, "Invalid refresh token")
      }

      if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401, "Refresh token is expired or used")
      }

      const options = {
         httpOnly: true,
         secure: true
      }

      const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)

      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
         new ApiResponse(
            200,
            {accessToken, refreshToken: newrefreshToken},
            "Access token refreshed"
         )
      )
   } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
   }
})







export{
   registerUser,
   loginUser,
   logoutUser,
}