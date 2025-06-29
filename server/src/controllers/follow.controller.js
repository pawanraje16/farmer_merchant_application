import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Follow } from "../models/follow.model.js";


const followUser = asyncHandler(async (req, res) => {
  console.log("We are in the Tofollow controller")
  const currentUserId = req.user?._id;
  const { username: toFollowUsername } = req.params;
  console.log(toFollowUsername);

  const toFollowUser = await User.findOne({ username: toFollowUsername });

  if (!toFollowUser) {
    throw new ApiError(404, "User not found");
  }

  if (toFollowUser._id.equals(currentUserId)) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const existingFollow = await Follow.findOne({
    follower: currentUserId,
    following: toFollowUser._id,
  });
  console.log("hello this is the existing user",existingFollow)
  if (existingFollow) {
    throw new ApiError(400, "Already following this user");
  }

  await Follow.create({
    follower: currentUserId,
    following: toFollowUser._id,
  });

  res.status(200).json(new ApiResponse(200, null, `Now following ${toFollowUsername}`));
});


const unfollowUser = asyncHandler(async() => {
    const currentUser = req.user?._id;
    const toUnfollowusername = req.params;
})


export{
    followUser
}