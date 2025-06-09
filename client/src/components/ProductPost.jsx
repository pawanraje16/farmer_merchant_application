import { useNavigate } from "react-router-dom"
import PostImage from "./PostImage"

const ProductPost = ({ post }) => {
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

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 hover:border-green-200 relative overflow-hidden">
      {/* Featured Badge */}
      {post.isFeatured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          ⭐ Featured
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
        {/* Post Images */}
        <div className="lg:w-1/3">
          <div className="grid grid-cols-2 gap-3">
            {post.images.slice(0, 4).map((image, index) => (
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
              <p className="text-gray-600 leading-relaxed">{post.description} pawanraje Ukarde patil</p>
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
                  post.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {post.isAvailable ? "✅ Available" : "❌ Sold Out"}
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center space-x-1 hover:text-red-500 cursor-pointer transition-colors">
                <span>❤️</span>
                <span>{post.likes}</span>
              </span>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPost
