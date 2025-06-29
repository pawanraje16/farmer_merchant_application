import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const likePost = asyncHandler(async(req, res) => {
    const userId  = req.user?._id;
    const {postId} = req.params;

    console.log("we are in like controller")

    const existingLike = await Like.findOne({ post: postId, likedBy: userId});
    if(existingLike){
        throw new ApiError(400, "Post already liked by this user");
    }

    const like = await Like.create({
        post: postId,
        likedBy: userId,
    });

    res
    .status(201)
    .json(new ApiResponse(201, like, "Post liked"));
});

const unlikePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  const deletedLike = await Like.findOneAndDelete({ post: postId, likedBy: userId });

  if (!deletedLike) {
    throw new ApiError(404, "Like not found for this user on this post");
  }

  res.status(200).json(new ApiResponse(200, null, "Post unliked"));
});



export{
    likePost,
    unlikePost,
}