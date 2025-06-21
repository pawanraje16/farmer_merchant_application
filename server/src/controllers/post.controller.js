import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

  if(!postId)
  {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId)
  .populate("author","username fullname avatar")
  .lean()

  if(!post) {
    throw new ApiError(404, "Post not found");
  }

  return res.status(200).json(new ApiResponse(200, post, "Post details fetched successfully"));
})


const getAllPosts = asyncHandler (async (req, res) => {
  const posts = await Post.find({})
  .sort({ createdAt: -1})
  .populate("author", "fullName avatar username")
  .lean();
  console.log(posts)
  res.status(200)
  .json(new ApiResponse (200, posts, "All posts fetched"));
});

const getLoggedInUserPosts = asyncHandler (async(req, res)=> {
  const userId = req.user?._id;
  const posts = await Post.find({ author: userId}).sort({createdAt: -1});
  console.log(posts);
  res
  .status(200)
  .json(new ApiResponse(200, posts, "User posts Fetched"))
})

const getUserPosts = asyncHandler (async (req, res) => {
       const{ username} = req.params;
       const user = await User.findOne({username}).select("_id").lean();

       if (!user) {
        throw new ApiError(404, "User Not found while fetching the uesr posts");
       }
       const posts = await Post.find({ author: user._id}).sort({createdAt: -1});
       console.log(posts);
       res
       .status(200)
       .json(new ApiResponse(200, posts, "User posts Fetched"))
})

export {
  createPost,
  getPostById,
  getAllPosts,
  getLoggedInUserPosts,
  getUserPosts
}