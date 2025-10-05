import { useNavigate } from "react-router-dom"
import PostImage from "./PostImage"
import { useState } from "react"
import { toggleLike } from "../utils/like"
import { usePost } from "../context/PostContext"
import { useAuth } from "../context/AuthContext"


const ProductPost = ({ post, isOwnProfile = false }) => {
     const [isLiked, setIsLiked] = useState(post.isLiked)
       const [likesCount, setLikesCount] = useState(post.likesCount)
       const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
       const [isAvailable, setIsAvailable] = useState(post.isAvailable)
       const { deletePost, togglePostAvailability } = usePost()
       const { user } = useAuth()


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

  const navigate= useNavigate();

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

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 hover:border-green-200 relative overflow-hidden">
      {/* Featured Badge */}
      {post?.isFeatured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          ⭐ Featured
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
        {/* Post Images */}
        <div className="lg:w-1/3">
          <div className="grid grid-cols-2 gap-3">
            {post?.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all"
                onClick={() => navigate(`/post/${post._id}`)}
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
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{post.description} </p>
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
                <span>{post.location.city}</span>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {isAvailable ? "✅ Available" : "❌ Sold Out"}
              </span>
              {isOwnProfile && (
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
                <span>{getTimeAgo(post.createdAt)}</span>
              </div>
              {isOwnProfile && (
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

export default ProductPost
