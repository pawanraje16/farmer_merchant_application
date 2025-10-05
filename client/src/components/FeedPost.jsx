

import { useState } from "react"
import PostImage from "./PostImage"
import { useFeed } from "../context/FeedContext"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toggleLike } from "../utils/like"
import toast from "react-hot-toast"
import { usePost } from "../context/PostContext"

const FeedPost = ({ post, onAuthorClick}) => {

  const navigate=useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isAvailable, setIsAvailable] = useState(post.isAvailable)
  const {user} = useAuth();
  const { deletePost, togglePostAvailability } = usePost();

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))

    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleLike = async (e) => {
  e.stopPropagation();
  try {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => isLiked ? prev - 1 : prev + 1);
    
    await toggleLike(post._id, !isLiked); // like/unlike call
   
  } catch (err) {
    console.error("Like toggle failed", err);
    // Revert UI in case of error
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => isLiked ? prev + 1 : prev - 1);
  }
}

  const handlePostClick = (postId) =>{
    //  e.stopPropagation()
     navigate(`/post/${postId}`)
  }
  const handleAuthorClick = (username) => {
    if(username===user.username){
      navigate(`/profile`)
    }
    else {
   navigate(`/user/${username}`)}
  }

  const handleChatClick = (authorId) => {
    navigate(`/chat/${authorId}`)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  }

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    const success = await deletePost(post._id);
    if (success) {
      setShowDeleteConfirm(false);
    }
  }

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  }

  const handleToggleAvailability = async (e) => {
    e.stopPropagation();
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    const success = await togglePostAvailability(post._id, newAvailability);
    if (!success) {
      // Revert on failure
      setIsAvailable(!newAvailability);
    }
  }

  const isOwnPost = user?._id === post.author._id;

  return (
    <div
      className="group bg-gradient-to-br from-red to-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 hover:border-green-200 relative overflow-hidden cursor-pointer"
     
    >
      {/* Featured Badge */}
      {post.isFeatured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
          ⭐ Featured 
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-center justify-between mb-6">
        <div
          className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors"
          onClick={() => handleAuthorClick(post?.author?.username)}
        >
          <div className="relative">
            <img
              src={post.author.avatar || "/placeholder.svg?height=50&width=50"}
              alt={post.author.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
            />
            {post.author.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                <span className="text-xs">✓</span>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 flex items-center space-x-2">
              <span>{post.author.fullName}</span>
              <span className="text-yellow-500 text-sm">⭐{post.author.rating}</span>
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  post.author.userType === "farmer" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {post.author.userType === "farmer" ? "🚜" : "🏪"} {post.author.userType}
              </span>
              <span>•</span>
              <span>{getTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {!isOwnPost && (
          <button
            onClick={() => handleChatClick(post.author.username) }
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium text-sm"
          >
            💬 Chat
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
        {/* Post Images */}
        <div className="lg:w-1/3"  onClick={() =>handlePostClick(post._id)} >
        
          <div className="grid grid-cols-2 gap-3">
            {post.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all"
              >
                <PostImage src={image} alt={`${post.title} - Image ${index + 1}`} className="w-full h-24 md:h-32" />
                {index === 3 && post.images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                    +{post.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <div className="lg:w-2/3 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{post.description}</p>
            </div>
            <div className="text-right ml-4">
              <div className="flex items-center space-x-2">
                {post.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">₹{post.originalPrice}</span>
                )}
                <span className="text-2xl md:text-3xl font-bold text-green-600">₹{post.price}</span>
              </div>
              <div className="text-sm text-gray-500">{post.priceUnit}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {/* Post Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <span>📦</span>
                <span>{post.quantity}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>📍</span>
                <span>
                  {post.location.city}, {post.location.state}
                </span>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {isAvailable ? "✅ Available" : "❌ Sold Out"}
              </span>
              {isOwnPost && (
                <button
                  onClick={handleToggleAvailability}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    isAvailable
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                  title={isAvailable ? "Mark as sold out" : "Mark as available"}
                >
                  {isAvailable ? "Mark Sold" : "Mark Available"}
                </button>
              )}
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 transition-colors ${
                    isLiked ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  <span>{isLiked ? "❤️" : "🤍"}</span>
                  <span>{likesCount}</span>
                </button>
                <span className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer transition-colors">
                  <span>💬</span>
                  <span>{post.comments}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>👁️</span>
                  <span>{post.views}</span>
                </span>
              </div>
              {isOwnPost && (
                <button
                  onClick={handleDeleteClick}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  title="Delete post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50" onClick={handleCancelDelete}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border-2 border-gray-200" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Post?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedPost
