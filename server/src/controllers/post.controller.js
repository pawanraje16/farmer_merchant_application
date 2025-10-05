import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteMultipleFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";




const createPost = asyncHandler(async (req, res) => {
    const {
        title,
        category,
        cropType,
        description,
        price,
        priceUnit,
        quantity,
        tags,
        variety,
        shelLife,
        packaging,
        minorderQunatity,
        state,
        village,
        city,
        district,
        pincode,
    } = req.body;

    const userId = req.user?._id

    if (
    !cropType ||
    !category ||
    !title ||
    !description ||
    !price ||
    !priceUnit ||
    !quantity ||
    !state ||
    !district ||
    !city ||
    !village ||
    !shelLife
  ) {
     throw new ApiError(400,"All required fields must be provided.");
  }

  
  const files = req.files?.images || req.files;  // array() vs fields()
  if (!files || files.length === 0) {
    throw new ApiError(400, "At least one image is required.");
   }

  // upload images to cloudinary
  const uploadResults = await Promise.all(
    files.map((f) => uploadOnCloudinary(f.buffer, f.mimetype, "posts"))
  );
  const imageUrls = uploadResults
   .map((r) => r?.secure_url)   // secure_url for stream uploads
   .filter(Boolean);

  if (imageUrls.length === 0) {
    throw new ApiError(400, "Image upload failed.");
  }

  const parsedTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string" && tags.trim() !== ""
      ? tags.split(",").map(t => t.trim())
      : [];
  
  const post = await Post.create({
    cropType,
    category,
    images: imageUrls,
    title,
    description,
    price,
    priceUnit,
    quantity,
    tags: parsedTags,
    specifications: {
      variety,
      shelLife,
      packaging,
      minorderQunatity
    },
    location: {
      state,
      district,
      city,
      village,
      pincode
    },
    author: userId
  });
  
    return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const getPostById = asyncHandler ( async (req, res) => {
  const {postId} = req.params;
  console.log(`fetching the post req having id : ${postId}`)
  if(!postId)
  {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId)
  .populate("author","username fullname avatar createdAt")
  .lean()

  if(!post) {
    throw new ApiError(404, "Post not found");
  }

  return res.status(200).json(new ApiResponse(200, post, "Post details fetched successfully"));
})


const getAllPosts = asyncHandler(async (req, res) => {
  const currentUserId = req.user?._id;

  const posts = await Post.aggregate([
    {
      $sort: { createdAt: -1 }
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    {
      $unwind: "$author"
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes"
      }
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLiked: {
          $in: [
            currentUserId,
            {
              $map: {
                input: "$likes",
                as: "like",
                in: "$$like.likedBy"
              }
            }
          ]
        }
      }
    },
    {
      $project: {
        "likes": 0,
        "author.password": 0,
        "author.refreshToken": 0
      }
    }
  ]);
  console.log(posts)
  res.status(200).json(new ApiResponse(200, posts, "All posts fetched"));
});

const getLoggedInUserPosts = asyncHandler (async(req, res)=> {
  const userId = req.user?._id;
  // const posts = await Post.find({ author: userId}).sort({createdAt: -1});
  const posts = await Post.aggregate([
    {
      $match: { author: userId }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $lookup: {
        from: "likes",           // Match collection name used for Like model
        localField: "_id",
        foreignField: "post",
        as: "likes"
      }
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLiked: {
          $in: [
            userId,
            {
              $map: {
                input: "$likes",
                as: "like",
                in: "$$like.likedBy"
              }
            }
          ]
        }
      }
    },
    {
      $project: {
         likes: 0,
         "authorDetails": 0,
      }
    }
  ]);
  console.log(posts);
  res
  .status(200)
  .json(new ApiResponse(200, posts, "User posts Fetched"))
})

const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const  currentUserId = req.user?._id;

  const user = await User.findOne({ username }).select("_id").lean();

  if (!user) {
    throw new ApiError(404, "User not found while fetching the user posts");
  }

  const posts = await Post.aggregate([
    {
      $match: { author: user._id }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes"
      }
    },
     {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLiked: {
          $in: [
            currentUserId,
            {
              $map: {
                input: "$likes",
                as: "like",
                in: "$$like.likedBy"
              }
            }
          ]
        }
      }
    },
    {
      $project: {
        likes: 0,
        authorDetails: 0,
      }
    }
  ]);

  res.status(200).json(new ApiResponse(200, posts, "User posts fetched"));
});


const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user is the author of the post
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  // Delete images from Cloudinary
  if (post.images && post.images.length > 0) {
    try {
      await deleteMultipleFromCloudinary(post.images);
      console.log(`Deleted ${post.images.length} images from Cloudinary for post ${postId}`);
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
      // Continue with post deletion even if Cloudinary deletion fails
    }
  }

  // Delete the post from database
  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const updatePostAvailability = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { isAvailable } = req.body;
  const userId = req.user?._id;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  if (typeof isAvailable !== "boolean") {
    throw new ApiError(400, "isAvailable must be a boolean value");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user is the author of the post
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  post.isAvailable = isAvailable;
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post availability updated successfully"));
});

export {
  createPost,
  getPostById,
  getAllPosts,
  getLoggedInUserPosts,
  getUserPosts,
  deletePost,
  updatePostAvailability
}