

import { useState } from "react"
import PostImage from "./PostImage"
import { useFeed } from "../context/FeedContext"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toggleLike } from "../utils/like"
import toast from "react-hot-toast"

const FeedPost = ({ post, onAuthorClick}) => {

  const navigate=useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const {user} = useAuth();

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

        <button
          onClick={() => handleChatClick(post.author.username) }
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium text-sm"
        >
          💬 Chat
        </button>
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
                  post.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {post.isAvailable ? "✅ Available" : "❌ Sold Out"}
              </span>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedPost
