

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ProductPost from "../components/ProductPost"
import pawanImage from "./profilePhoto/pawan.png"; // relative path from Profile.jsx
import { fruits, proPhoto } from "../assets/assets";


const Profile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editForm, setEditForm] = useState({})

  // Mock user data with enhanced structure
  const mockUserProfile = {
    _id: "user123",
    username: "farmer_raj",
    email: "raj@example.com",
    userType: "farmer",
    majorProduct: "Rice, Wheat, Organic Vegetables",
    profilePhoto: proPhoto.ram,
    coverPhoto: "/placeholder.svg?height=300&width=800",
    fullName: "Raj Kumar Singh",
    aadhaarNumber: "1234****5678",
    location: {
      state: "Punjab",
      district: "Ludhiana",
      city: "Ludhiana",
      pincode: "141001",
    },
    bio: "🌾 Passionate organic farmer with 10+ years of experience. Specializing in sustainable agriculture and premium quality rice & wheat cultivation. Committed to providing chemical-free, healthy food to families across India.",
    farmDetails: {
      farmSize: "15 acres",
      farmingType: "Organic",
      experience: "10+ years",
      certifications: ["Organic Certified", "Fair Trade"],
    },
    businessDetails: {
      businessName: "Raj Organic Farm",
      gstNumber: "GST123456789",
      businessType: "Individual Farmer",
    },
    contactInfo: {
      phone: "9876543210",
      whatsapp: "9876543210",
      alternatePhone: "",
    },
    socialStats: {
      totalPosts: 8, // Updated from 24 to 8 to match actual posts
      followers: 1256,
      following: 189,
      rating: 4.8,
      totalReviews: 143,
    },
    achievements: [
      { title: "Top Seller", icon: "🏆", description: "Best seller this month" },
      { title: "Verified Farmer", icon: "✅", description: "Identity verified" },
      { title: "Quality Producer", icon: "⭐", description: "5-star rated products" },
    ],
    joinedDate: "2023-06-15",
    isVerified: true,
    isOnline: true,
    lastActive: "2024-01-15T10:30:00Z",
  }

  const mockUserPosts = [
    {
      _id: "feed_post_7",
      title: "Premium Organic Basmati Rice - Farm Fresh",
      description:
        "Freshly harvested premium basmati rice from my organic farm. No chemicals, no pesticides. Perfect for healthy cooking and special occasions.",
      images: [
        fruits.pomo[0],
        fruits.pomo[1],
        fruits.pomo[2],
      ],
      price: 85,
      priceUnit: "per kg",
      originalPrice: 95,
      category: "Grains",
      quantity: "500 kg available",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: true,
      isFeatured: true,
      createdAt: "2024-01-10T08:00:00Z",
      likes: 45,
      comments: 12,
      views: 234,
      tags: ["organic", "premium", "basmati"],
    },
    {
      _id: "post2",
      title: "Fresh Wheat Flour - Stone Ground",
      description:
        "Traditional stone-ground wheat flour made from our premium wheat. Rich in nutrients and perfect for making rotis, bread, and other delicacies.",
      images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
      price: 45,
      priceUnit: "per kg",
      originalPrice: 50,
      category: "Grains",
      quantity: "200 kg available",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: true,
      isFeatured: false,
      createdAt: "2024-01-08T14:30:00Z",
      likes: 28,
      comments: 8,
      views: 156,
      tags: ["wheat", "flour", "traditional"],
    },
    {
      _id: "post3",
      title: "Fresh Organic Tomatoes - Vine Ripened",
      description:
        "Juicy, vine-ripened organic tomatoes grown without any chemicals. Perfect for cooking, salads, and making fresh sauces. Harvested this morning!",
      images: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      price: 60,
      priceUnit: "per kg",
      originalPrice: null,
      category: "Vegetables",
      quantity: "100 kg available",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: true,
      isFeatured: true,
      createdAt: "2024-01-12T06:00:00Z",
      likes: 67,
      comments: 15,
      views: 289,
      tags: ["organic", "fresh", "tomatoes", "vegetables"],
    },
    {
      _id: "post4",
      title: "Pure Desi Cow Milk - Daily Fresh",
      description:
        "Fresh, pure desi cow milk delivered daily. Our cows are grass-fed and healthy. Rich in nutrients and completely natural. Home delivery available.",
      images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
      price: 70,
      priceUnit: "per liter",
      originalPrice: null,
      category: "Dairy",
      quantity: "50 liters daily",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: true,
      isFeatured: false,
      createdAt: "2024-01-11T05:30:00Z",
      likes: 34,
      comments: 9,
      views: 178,
      tags: ["milk", "desi", "cow", "fresh", "daily"],
    },
    {
      _id: "post5",
      title: "Seasonal Mixed Vegetables Box",
      description:
        "Fresh seasonal vegetables box containing potatoes, onions, carrots, cabbage, and green beans. All organically grown on our farm. Perfect for families.",
      images: [
        "https://images.app.goo.gl/DYXBxqjZX46cbpN4A",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      price: 250,
      priceUnit: "per box (5kg)",
      originalPrice: 300,
      category: "Vegetables",
      quantity: "30 boxes available",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: true,
      isFeatured: false,
      createdAt: "2024-01-09T16:45:00Z",
      likes: 23,
      comments: 6,
      views: 145,
      tags: ["vegetables", "mixed", "seasonal", "family", "box"],
    },
    {
      _id: "post6",
      title: "Premium Mustard Oil - Cold Pressed",
      description:
        "Pure, cold-pressed mustard oil made from our own mustard seeds. Traditional wooden press method ensures maximum nutrition and authentic taste.",
      images: ["/placeholder.svg?height=300&width=400"],
      price: 180,
      priceUnit: "per liter",
      originalPrice: 200,
      category: "Oil & Spices",
      quantity: "25 liters available",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: true,
      isFeatured: true,
      createdAt: "2024-01-07T12:00:00Z",
      likes: 41,
      comments: 11,
      views: 203,
      tags: ["mustard", "oil", "cold-pressed", "traditional", "pure"],
    },
    {
      _id: "post7",
      title: "Fresh Farm Eggs - Free Range",
      description:
        "Fresh eggs from our free-range chickens. The chickens roam freely and eat natural feed. Rich in protein and completely natural. Collected daily.",
      images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
      price: 8,
      priceUnit: "per piece",
      originalPrice: null,
      category: "Poultry",
      quantity: "200 eggs available",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: true,
      isFeatured: false,
      createdAt: "2024-01-13T07:15:00Z",
      likes: 19,
      comments: 4,
      views: 98,
      tags: ["eggs", "free-range", "fresh", "daily", "protein"],
    },
    {
      _id: "post8",
      title: "Organic Jaggery (Gur) - Traditional",
      description:
        "Pure organic jaggery made from our sugarcane using traditional methods. No chemicals or artificial additives. Rich in iron and minerals. Perfect for winter.",
      images: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      price: 120,
      priceUnit: "per kg",
      originalPrice: null,
      category: "Sweeteners",
      quantity: "80 kg available",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: false, // Sold out example
      isFeatured: false,
      createdAt: "2024-01-05T14:20:00Z",
      likes: 52,
      comments: 18,
      views: 267,
      tags: ["jaggery", "gur", "organic", "traditional", "sugarcane"],
    },
  ]

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setUserProfile(mockUserProfile)
        setUserPosts(mockUserPosts)
        setEditForm(mockUserProfile)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUserProfile(editForm)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))

    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  if (isLoading && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Profile Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
          {/* Cover Photo with Gradient Overlay */}
          <div className="relative h-64 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-blue-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

            {/* Floating Elements */}
            <div className="absolute top-6 right-6 flex space-x-2">
              {userProfile?.isOnline && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 backdrop-blur-sm bg-opacity-90">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              )}
              {userProfile?.isVerified && (
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-opacity-90">
                  ✓ Verified
                </div>
              )}
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{userProfile?.fullName}</h1>
              <div className="flex items-center space-x-4 text-green-100">
                <span className="flex items-center space-x-1">
                  <span>@</span>
                  <span>{userProfile?.username}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>
                    {userProfile?.location?.city}, {userProfile?.location?.state}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 md:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
              {/* Left Side - Profile Photo & Info */}
              <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 p-1">
                    <img
                      src={userProfile?.profilePhoto || "https://images.app.goo.gl/DYXBxqjZX46cbpN4A"}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-3 shadow-lg">
                    <span className="text-2xl">{userProfile?.userType === "farmer" ? "🚜" : "🏪"}</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold capitalize shadow-lg">
                      {userProfile?.userType}
                    </span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <span className="text-lg">⭐</span>
                      <span className="font-bold text-gray-900">{userProfile?.socialStats?.rating}</span>
                      <span className="text-gray-500 text-sm">({userProfile?.socialStats?.totalReviews})</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">{userProfile?.bio}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>Joined {formatDate(userProfile?.joinedDate)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>🌾</span>
                      <span>{userProfile?.majorProduct}</span>
                    </span>
                  </div>

                  {/* Achievements */}
                  <div className="flex flex-wrap gap-3">
                    {userProfile?.achievements?.map((achievement, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 px-3 py-2 rounded-xl flex items-center space-x-2 group hover:shadow-md transition-all"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">{achievement.icon}</span>
                        <span className="text-sm font-medium text-gray-800">{achievement.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Stats & Actions */}
              <div className="lg:text-right space-y-6">
                {/* Enhanced Stats */}
                <div className="grid grid-cols-3 gap-6 lg:gap-8">
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                      <div className="text-2xl font-bold">{userProfile?.socialStats?.totalPosts}</div>
                      <div className="text-sm opacity-90">Posts</div>
                    </div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                      <div className="text-2xl font-bold">{userProfile?.socialStats?.followers}</div>
                      <div className="text-sm opacity-90">Followers</div>
                    </div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                      <div className="text-2xl font-bold">{userProfile?.socialStats?.following}</div>
                      <div className="text-sm opacity-90">Following</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    ✏️ Edit Profile
                  </button>
                  <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
                    📤 Share Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <nav className="flex space-x-1 px-6">
              {[
                { id: "posts", label: "My Posts", icon: "📝", count: userProfile?.socialStats?.totalPosts },
                { id: "about", label: "About", icon: "ℹ️" },
                { id: "reviews", label: "Reviews", icon: "⭐", count: userProfile?.socialStats?.totalReviews },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 px-6 font-medium text-sm transition-all duration-300 rounded-t-2xl ${
                    activeTab === tab.id
                      ? "bg-white text-green-600 shadow-lg -mb-px border-t-2 border-green-500"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === "posts" && (
              <div className="space-y-8">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => <ProductPost key={post._id} post={post} />)
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                      <span className="text-6xl">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No posts yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Start sharing your amazing products with the farming community!
                    </p>
                    <button
                      onClick={() => navigate("/create-post")}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      🌾 Create Your First Post
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span className="text-2xl">👤</span>
                    <span>Personal Information</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: userProfile?.fullName, icon: "👨‍🌾" },
                      { label: "Email", value: userProfile?.email, icon: "✉️" },
                      { label: "Phone", value: userProfile?.contactInfo?.phone, icon: "📱" },
                      { label: "Aadhaar", value: userProfile?.aadhaarNumber, icon: "🆔" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-500">{item.label}</div>
                          <div className="text-gray-900 font-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Information Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-100">
                  <h3
                    className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2
                    "
                  >
                    <span className="text-2xl">{userProfile?.userType === "farmer" ? "🚜" : "🏢"}</span>
                    <span>{userProfile?.userType === "farmer" ? "Farm Details" : "Business Details"}</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: userProfile?.userType === "farmer" ? "Farm Name" : "Business Name",
                        value: userProfile?.businessDetails?.businessName,
                        icon: "🏪",
                      },
                      { label: "Specialization", value: userProfile?.majorProduct, icon: "🌾" },
                      { label: "Farm Size", value: userProfile?.farmDetails?.farmSize, icon: "📏" },
                      { label: "Experience", value: userProfile?.farmDetails?.experience, icon: "⏰" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-500">{item.label}</div>
                          <div className="text-gray-900 font-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Information Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span className="text-2xl">📍</span>
                    <span>Location Details</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "State", value: userProfile?.location?.state, icon: "🗺️" },
                      { label: "District", value: userProfile?.location?.district, icon: "🏘️" },
                      { label: "City", value: userProfile?.location?.city, icon: "🏙️" },
                      { label: "Pincode", value: userProfile?.location?.pincode, icon: "📮" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-500">{item.label}</div>
                          <div className="text-gray-900 font-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border border-yellow-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span className="text-2xl">🏆</span>
                    <span>Certifications & Achievements</span>
                  </h3>
                  <div className="space-y-3">
                    {userProfile?.farmDetails?.certifications?.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xl">✅</span>
                        <div className="text-gray-900 font-medium">{cert}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                  <span className="text-6xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews & Ratings</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Reviews from customers will appear here to build trust and credibility
                </p>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 max-w-md mx-auto border border-yellow-200">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{userProfile?.socialStats?.rating}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${i < Math.floor(userProfile?.socialStats?.rating) ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600">
                    Based on <span className="font-semibold">{userProfile?.socialStats?.totalReviews}</span> reviews
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span className="text-3xl">✏️</span>
                  <span>Edit Profile</span>
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Major Product</label>
                    <input
                      type="text"
                      name="majorProduct"
                      value={editForm.majorProduct || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="contactInfo.phone"
                      value={editForm.contactInfo?.phone || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Business Name</label>
                    <input
                      type="text"
                      name="businessDetails.businessName"
                      value={editForm.businessDetails?.businessName || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={editForm.bio || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    {isLoading ? "Saving..." : "💾 Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
