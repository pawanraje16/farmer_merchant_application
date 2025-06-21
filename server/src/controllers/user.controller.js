import { User } from "../models/user.model.js";
import { ApiError  } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// future utils
// import {deleteFromCloudinary} from "../utils/cloudinary.js"



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

const registerUser = asyncHandler(async (req, res) => {
  console.log("Received body: ", req.body);
  console.log("Received files: ", req.files);

  const {
    fullName,
    contact,
    username,
    email,
    adharNo,
    userType,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password must be equal");
  }

  // Check required fields
  if (
    [fullName, contact, username, email, adharNo, userType, password, confirmPassword]
      .some((field) => !field?.trim())
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check for duplicate user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }, { adharNo }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with email, username, or Aadhaar number already exists"
    );
  }

  // Handle avatar upload
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Error uploading avatar");
  }

  // Create user
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
    adharNo,
    contact,
    userType,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // ✅ Generate and save tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only sent over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge:  7 * 24 * 60 * 60 *1000 // maxAge 7 days
  };

  // ✅ Return user + cookies
  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "User registered successfully"
      )
    );
});


const loginUser = asyncHandler(async (req, res) => {
   const {email, password} = req.body
   console.log(req.body);
   if(!(email)){
      throw new ApiError(400, "username or mail is required")
   }

   const user = await User.findOne({email
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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 *1000
   }
   console.log(loggedInUser)
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
         },
      },
      {
         new: true
      }
   )

   const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
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

const changeCurrentPassword = asyncHandler(async(req, res) => {
   const {oldPassword, newPassword} = req.body;

   const user = await User.findById(req.user?._id)
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave: false}); // Skip shcema validation ,just save password don't scan the scheam validation

   return res
   .status(200)
   .json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getCurrentUser = asyncHandler(async(req, res) => {

   console.log(req.user)
   return res
   .status(200)
   .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler (async(req, res) => {
   const {fullName, email} = req.body

   if(!fullName || !email) {
      throw new ApiError(400, "All fields are required")
   }

   const user = await User.findByIdAndUpdate(req.user?._id,
      {
         $set: {
            fullName,
            email
         },
      },
      {new: true} // return the changed one
   ).select("-password")

   return res
   .status(200)
   .json(new ApiResponse(200, user, "Account details updated successfully"))

})

const updateUserAvatar = asyncHandler(async(req, res) => {
   const avatarLocalPath = req.file?.path

   if(!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url){
      throw new ApiError(400, "Error while uploading on avatar")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            avatar: avatar.url
         }
      },
      {new : true}
   ).select("-password")

   return res
   .statu(200)
   .json(
      new ApiResponse(200, user, "avatar updated successfully")
   )
})

// const updateUserCoverImage = asyncHandler(async(req, res) => {
//    const coverImageLocalPath = req.file?.path

//    if(!coverImageLocalPath){
//       throw new ApiError(400, "Cover Image file is missing")
//    }

//    //TODO : delete old image -> to do this we also have to store publicId wit url at the time of upload

//    const  coverImage = await uploadOnCloudinary(coverImageLocalPath)

//    if(!coverImage.url){
//       throw new ApiError(400, "Error while uploading on Cover Image")
//    }

//    const user = await User.findByIdAndUpdate(
//       req.user?._id,
//       {
//          $set: {
//             coverImage: coverImage.url
//          }
//       },
//       {new: true}
//    ).select("-password")

//    return res
//    .status(200)
//    .json(
//       new ApiResponse(200, user, "Cover image updated successfully")
//    )
// })

const updateUserCoverImage= asyncHandler (async (req, res) => {

   const coverImageLocalPath = req.file?.path;
   console.log(req.file?.path);
   if(!coverImageLocalPath) throw new ApiError(400, "Cover image file is missing!");

   const userId = req.user._id;

   const existedUser = await User.findById(userId).select("coverImage");
    
   // Future TODO
   // if(existedUser?.coverImage?.publicId){
   //    try {
   //       await deleteFromCloudinary(existedUser.coverImage.publicId);
   //    } catch (error) {
         
   //    }
   // }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
   if(!coverImage?.url) throw new ApiError(400, "Failed to upload cover image");

   const updatedUser = await User.findByIdAndUpdate(
       userId,
       {
         $set: {
            coverImage: coverImage.url,
         },
       },
       {new : true}
   ).select("-password -refreshToken");

   console.log("update cover Image: ", updatedUser.coverImage);

   return res
   .status(200)
   .json(
      new ApiResponse (
         200,
         updatedUser.coverImage,
         "Cover Image Updaated"
      )
   )
})

const getLoggedInUseProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    
    const userProfile = await User.aggregate([
      {
         $match: {_id: userId},
      },
      {
         $lookup: {
            from : "addresses",
            localField: "_id",
            foreignField: "user",
            as: "address",
         },
      },
      {
         $addFields: {
            address: { $arrayElemAt: ["$address", 0] },
         },
      },
      {
         $project: {
            password: 0,
            refreshToken : 0,
            _id: 0,
         }
      }
    ])
    console.log(userProfile)
    if(!userProfile || userProfile.length ===0 ){
      throw new ApiError(404, "User profile not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, userProfile[0], "User profile with address & stats"));
});

const getUserByUsername = asyncHandler (async(req, res) => {
   const {username} =req.params;


   const user = await User.findOne({username}).lean();

   if(!user) throw new ApiError(404, `user not found username : ${username}`)
   else console.log(`user found ${user.username}`)

   const userProfile = await User.aggregate([
      {
         $match: {_id: user?._id},
      },
      {
         $lookup: {
            from : "addresses",
            localField: "_id",
            foreignField: "user",
            as: "address",
         },
      },
      {
         $addFields: {
            address: { $arrayElemAt: ["$address", 0] },
         },
      },
      {
         $project: {
            password: 0,
            refreshToken: 0,
         }
      },
   ])
   console.log(userProfile)
   if(!userProfile || userProfile.length === 0) {
      throw new ApiError(404, "User profile not found !")
   }

   return res
   .status(200)
   .json(new ApiResponse(200, userProfile[0], "User profile with address & stats"));
});














export{
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentUser,
   updateAccountDetails,
   updateUserAvatar,
   updateUserCoverImage,
   getLoggedInUseProfile,
   getUserByUsername,
}