

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PostImage from "../components/PostImage"
import LoadingSpinner from "../components/LoadingSpinner"
import { useFeed } from "../context/FeedContext"
// import pomegranateImage from "../assets/pomegranate.png"; // Adjust the path as needed


const PostDetail = () => {
  const { postId } = useParams()
  const { id } = useParams();
  const {mockFeedPosts} = useFeed();
  const selectedPost = mockFeedPosts.find(post => post._id === id);
  // console.log(`${postId}`)
//  if (!postId) {
//   return <div className="text-center text-red-500 py-10 text-lg">Post not found: {postId}</div>
// }
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Mock post data - would be fetched from API based on postId
  const mockPost = {
    _id: "feed_post_1",
    title: "Premium Organic Basmati Rice - Farm Fresh",
    description:
      "Freshly harvested premium basmati rice from my organic farm. No chemicals, no pesticides. Perfect for healthy cooking and special occasions. This rice is grown using traditional farming methods that have been passed down through generations in our family. The grains are long, aromatic, and cook perfectly fluffy every time. We harvest only when the crop is fully mature to ensure the best flavor and nutritional value.",
     images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],

    price: 85,
    priceUnit: "per kg",
    originalPrice: 95,
    category: "Grains",
    cropType: "Rice",
    quantity: "500 kg available",
    location: {
      state: "Punjab",
      district: "Ludhiana",
      city: "Ludhiana",
      pincode: "141001",
      address: "Village Saharanpur, Near Grain Market",
    },
    isAvailable: true,
    isFeatured: true,
    isOrganic: true,
    createdAt: "2024-01-15T08:00:00Z",
    likes: 45,
    comments: 12,
    views: 234,
    tags: ["organic", "premium", "basmati", "rice", "punjab", "farm-fresh"],
    specifications: {
      variety: "Basmati 1121",
      harvestDate: "December 2023",
      shelfLife: "12 months",
      packaging: "Available in 5kg, 10kg, and 25kg bags",
      minOrderQuantity: "5 kg",
    },
    author: {
      _id: "user123",
      username: "farmer_raj",
      fullName: "Raj Kumar Singh",
      profilePhoto: "/placeholder.svg?height=100&width=100",
      userType: "farmer",
      isVerified: true,
      rating: 4.8,
      totalReviews: 156,
      location: "Ludhiana, Punjab",
      memberSince: "2022",
      contactInfo: {
        phone: "+91 98765 43210",
        email: "raj@example.com",
      },
    },
  }

  useEffect(() => {
    const loadPostDetails = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPost(mockPost)
      } catch (error) {
        console.error("Error loading post details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPostDetails()
  }, [postId])

  const handleAuthorClick = () => {
    navigate(`/user/${post.author._id}`)
  }

  const handleChatClick = () => {
    navigate(`/chat/${post.author._id}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading product details..." icon="🌾" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <span>←</span>
          <span>Back to results</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Product Gallery and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl overflow-hidden h-80 md:h-96">
                <PostImage
                  src={post.images[selectedImageIndex]}
                  alt={post.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`cursor-pointer rounded-xl overflow-hidden h-20 border-2 ${
                      selectedImageIndex === index ? "border-green-500" : "border-transparent"
                    }`}
                  >
                    <PostImage
                      src={image}
                      alt={`${post.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  {post.isOrganic && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      🌱 Organic
                    </span>
                  )}
                  {post.isFeatured && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                <p className="text-gray-600">{post.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">₹{post.price}</div>
                  <div className="text-sm text-gray-500">{post.priceUnit}</div>
                </div>
                {post.originalPrice && <div className="text-lg text-gray-400 line-through">₹{post.originalPrice}</div>}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Availability</div>
                    <div className="font-medium text-gray-900">
                      {post.isAvailable ? "✅ In Stock" : "❌ Out of Stock"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Quantity</div>
                    <div className="font-medium text-gray-900">{post.quantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium text-gray-900">
                      {post.location.city}, {post.location.state}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Posted On</div>
                    <div className="font-medium text-gray-900">{formatDate(post.createdAt)}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="text-sm text-gray-500 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Seller */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleChatClick}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    💬 Chat with Seller
                  </button>
                  <button
                    onClick={handleAuthorClick}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    👤 View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="px-6 md:px-8 py-6 bg-gray-50 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(post.specifications).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                  <div className="font-medium text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Info */}
          <div className="px-6 md:px-8 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About the Seller</h2>
            <div className="flex items-start space-x-4">
              <img
                src={post.author.profilePhoto || "/placeholder.svg"}
                alt={post.author.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-900">{post.author.fullName}</h3>
                  {post.author.isVerified && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <span>@{post.author.username}</span>
                  <span>•</span>
                  <span>{post.author.userType}</span>
                  <span>•</span>
                  <span>Member since {post.author.memberSince}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center text-yellow-500">
                    <span>⭐</span>
                    <span className="font-bold">{post.author.rating}</span>
                  </div>
                  <span className="text-gray-600">({post.author.totalReviews} reviews)</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleChatClick}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  💬 Chat
                </button>
                <button
                  onClick={handleAuthorClick}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  👤 Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
