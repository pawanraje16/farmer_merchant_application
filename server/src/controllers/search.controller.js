import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const searchSuggestions = asyncHandler(async (req, res) => {
  const { q: query } = req.query;
  const currentUserId = req.user?._id;

  if (!query || query.trim().length < 1) {
    throw new ApiError(400, "Search query must be at least 1 character long");
  }

  const searchTerm = query.trim();
  const suggestions = [];

  try {
    // Search for users only (Instagram-like search) - exclude current user
    const searchFilters = {
      $and: [
        {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { fullname: { $regex: searchTerm, $options: "i" } },
          ],
        }
      ]
    };

    // Exclude current logged-in user from results
    if (currentUserId) {
      searchFilters.$and.push({ _id: { $ne: currentUserId } });
    }

    const users = await User.find(searchFilters)
      .select("username fullname avatar userType address")
      .limit(10)
      .lean();

    users.forEach((user) => {
      suggestions.push({
        type: "user",
        _id: user._id,
        username: user.username,
        title: user.fullname || user.username,
        subtitle: `@${user.username} • ${user.userType || 'User'}`,
        avatar: user.avatar,
        userType: user.userType,
        location: user.address ? `${user.address.city}, ${user.address.state}` : null,
      });
    });

    res.status(200).json(
      new ApiResponse(200, suggestions, "User search suggestions fetched successfully")
    );
  } catch (error) {
    console.error("Search suggestions error:", error);
    throw new ApiError(500, "Failed to fetch search suggestions");
  }
});

const searchPosts = asyncHandler(async (req, res) => {
  const {
    q: query,
    category,
    state,
    district,
    priceMin,
    priceMax,
    sortBy = "latest",
    page = 1,
    limit = 20,
  } = req.query;

  const currentUserId = req.user?._id;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build search filters
  const searchFilters = [];

  // Text search
  if (query && query.trim()) {
    const searchTerm = query.trim();
    searchFilters.push({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { cropType: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { tags: { $in: [new RegExp(searchTerm, "i")] } },
      ],
    });
  }

  // Category filter (required to be non-empty)
  if (category && category !== "all") {
    searchFilters.push({ category });
  }

  // Location filters
  if (state && state !== "all") {
    searchFilters.push({ "location.state": state });
  }
  if (district && district !== "all") {
    searchFilters.push({ "location.district": district });
  }

  // Price range filter
  if (priceMin || priceMax) {
    const priceFilter = {};
    if (priceMin) priceFilter.$gte = parseFloat(priceMin);
    if (priceMax) priceFilter.$lte = parseFloat(priceMax);
    searchFilters.push({ price: priceFilter });
  }

  // Build sort criteria
  let sortCriteria = {};
  switch (sortBy) {
    case "price-low":
      sortCriteria = { price: 1 };
      break;
    case "price-high":
      sortCriteria = { price: -1 };
      break;
    case "popular":
      sortCriteria = { likesCount: -1, createdAt: -1 };
      break;
    case "latest":
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  const matchStage = searchFilters.length > 0 ? { $and: searchFilters } : {};

  try {
    const posts = await Post.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
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
                  in: "$$like.likedBy",
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          likes: 0,
          "author.password": 0,
          "author.refreshToken": 0,
        },
      },
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    // Get total count for pagination
    const totalPosts = await Post.aggregate([
      { $match: matchStage },
      { $count: "total" },
    ]);

    const total = totalPosts[0]?.total || 0;
    const hasNextPage = skip + posts.length < total;
    const hasPrevPage = page > 1;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          posts,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalPosts: total,
            hasNextPage,
            hasPrevPage,
          },
        },
        "Posts search completed successfully"
      )
    );
  } catch (error) {
    console.error("Posts search error:", error);
    throw new ApiError(500, "Failed to search posts");
  }
});

const searchUsers = asyncHandler(async (req, res) => {
  const { q: query, page = 1, limit = 20 } = req.query;
  const currentUserId = req.user?._id;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    let matchStage = {};

    if (query && query.trim().length >= 2) {
      // Search mode - find users matching the query
      const searchTerm = query.trim();
      matchStage = {
        $or: [
          { username: { $regex: searchTerm, $options: "i" } },
          { fullname: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Exclude current user from results
    if (currentUserId) {
      matchStage._id = { $ne: currentUserId };
    }

    const users = await User.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        },
      },
      {
        $addFields: {
          postsCount: { $size: "$posts" },
        },
      },
      {
        $project: {
          password: 0,
          refreshToken: 0,
          posts: 0,
        },
      },
      {
        $sort: query && query.trim().length >= 2
          ? { postsCount: -1, createdAt: -1 } // For search results
          : { createdAt: -1, postsCount: -1 }  // For suggested users (recent first)
      },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    // Get total count
    const totalUsers = await User.countDocuments(matchStage);

    const hasNextPage = skip + users.length < totalUsers;
    const hasPrevPage = page > 1;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          users,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / parseInt(limit)),
            totalUsers,
            hasNextPage,
            hasPrevPage,
          },
        },
        query && query.trim().length >= 2 ? "Users search completed successfully" : "Suggested users fetched successfully"
      )
    );
  } catch (error) {
    console.error("Users search error:", error);
    throw new ApiError(500, "Failed to search users");
  }
});

export { searchSuggestions, searchPosts, searchUsers };