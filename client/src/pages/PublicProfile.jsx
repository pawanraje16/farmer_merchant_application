"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import UserProfileHeader from "../components/UserProfileHeader"
import ProfileTabs from "../components/ProfileTabs"
import UserPosts from "../components/UserPosts"
import UserAbout from "../components/UserAbout"
import UserReviews from "../components/UserReviews"
import { useFeed } from "../context/FeedContext"

const PublicProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("posts")
  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  //debuggig
  const {mockFeedPosts}=useFeed();
  const user = mockFeedPosts.filter(post => post.author._id === userId);

  // Mock data for the public profile
  const mockPublicProfile = {
    _id: "user456",
    username: "organic_farmer_priya",
    email: "priya@example.com", // This might be hidden in real app
    userType: "farmer",
    majorProduct: "Organic Vegetables, Fruits, Herbs",
    profilePhoto: "/placeholder.svg?height=150&width=150",
    coverPhoto: "/placeholder.svg?height=300&width=800",
    fullName: "Priya Sharma",
    location: {
      state: "Maharashtra",
      district: "Pune",
      city: "Pune",
      pincode: "411001",
    },
    bio: "🌱 Certified organic farmer passionate about sustainable agriculture. Growing chemical-free vegetables and fruits for 8+ years. Committed to providing healthy, nutritious food while protecting our environment. Let's grow together! 🌿",
    farmDetails: {
      farmSize: "12 acres",
      farmingType: "Organic",
      experience: "8+ years",
      certifications: ["Organic Certified", "Sustainable Agriculture", "Fair Trade"],
    },
    businessDetails: {
      businessName: "Priya Organic Farm",
      gstNumber: "GST987654321",
      businessType: "Individual Farmer",
    },
    contactInfo: {
      phone: "9876543210",
      whatsapp: "9876543210",
      alternatePhone: "8765432109",
    },
    socialStats: {
      totalPosts: 15,
      followers: 2340,
      following: 456,
      rating: 4.9,
      totalReviews: 287,
    },
    achievements: [
      { title: "Organic Pioneer", icon: "🌱", description: "Leading organic farming practices" },
      { title: "Top Rated", icon: "⭐", description: "Highest customer satisfaction" },
      { title: "Eco Warrior", icon: "🌍", description: "Environmental conservation champion" },
    ],
    joinedDate: "2022-03-20",
    isVerified: true,
    isOnline: false,
    lastActive: "2024-01-14T18:45:00Z",
  }

  const mockPublicPosts = [
    {
      _id: "post101",
      title: "Fresh Organic Spinach - Iron Rich",
      description:
        "Freshly harvested organic spinach from our farm. Rich in iron, vitamins, and minerals. Perfect for healthy cooking and salads. No chemicals used.",
      images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
      price: 40,
      priceUnit: "per kg",
      originalPrice: null,
      category: "Vegetables",
      quantity: "80 kg available",
      location: {
        state: "Maharashtra",
        district: "Pune",
        city: "Pune",
      },
      isAvailable: true,
      isFeatured: true,
      createdAt: "2024-01-14T09:00:00Z",
      likes: 89,
      comments: 23,
      views: 456,
      tags: ["organic", "spinach", "iron-rich", "healthy"],
    },
    {
      _id: "post102",
      title: "Organic Tomatoes - Vine Ripened",
      description:
        "Sweet, juicy organic tomatoes ripened naturally on the vine. Perfect for cooking, salads, and sauces. Grown with love and care.",
      images: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      price: 55,
      priceUnit: "per kg",
      originalPrice: 65,
      category: "Vegetables",
      quantity: "120 kg available",
      location: {
        state: "Maharashtra",
        district: "Pune",
        city: "Pune",
      },
      isAvailable: true,
      isFeatured: false,
      createdAt: "2024-01-12T14:30:00Z",
      likes: 67,
      comments: 18,
      views: 334,
      tags: ["organic", "tomatoes", "vine-ripened", "fresh"],
    },
    {
      _id: "post103",
      title: "Mixed Organic Herbs Bundle",
      description:
        "Fresh organic herbs bundle including basil, mint, coriander, and parsley. Perfect for cooking and natural remedies. Aromatic and flavorful.",
      images: ["/placeholder.svg?height=300&width=400"],
      price: 80,
      priceUnit: "per bundle",
      originalPrice: null,
      category: "Herbs",
      quantity: "25 bundles available",
      location: {
        state: "Maharashtra",
        district: "Pune",
        city: "Pune",
      },
      isAvailable: true,
      isFeatured: true,
      createdAt: "2024-01-10T11:15:00Z",
      likes: 45,
      comments: 12,
      views: 198,
      tags: ["organic", "herbs", "fresh", "aromatic", "bundle"],
    },
  ]

  const mockReviews = [
    {
      reviewerName: "Amit Kumar",
      reviewerPhoto: "/placeholder.svg?height=50&width=50",
      rating: 5,
      comment:
        "Excellent quality organic vegetables! Fresh and tasty. Priya is very professional and delivers on time. Highly recommended!",
      date: "2 days ago",
      productName: "Organic Spinach",
    },
    {
      reviewerName: "Sunita Patel",
      reviewerPhoto: "/placeholder.svg?height=50&width=50",
      rating: 5,
      comment:
        "Best organic tomatoes I've ever bought. The taste is amazing and you can really tell the difference. Will definitely order again!",
      date: "1 week ago",
      productName: "Organic Tomatoes",
    },
    {
      reviewerName: "Rajesh Singh",
      reviewerPhoto: "/placeholder.svg?height=50&width=50",
      rating: 4,
      comment:
        "Good quality herbs, very fresh and aromatic. Packaging was excellent. Slightly expensive but worth it for organic quality.",
      date: "2 weeks ago",
      productName: "Herbs Bundle",
    },
  ]

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log(userId);
        setUserProfile(mockPublicProfile)
        setUserPosts(mockPublicPosts)
        setUserReviews(mockReviews)

        // Check if current user is following this user
        // This would come from your backend
        setIsFollowing(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId])

  const handleStartChat = async () => {
    setActionLoading(true)
    try {
      // Simulate API call to create/get chat
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Navigate to chat with this user
      navigate(`/chat/${userId}`)
    } catch (error) {
      console.error("Error starting chat:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleFollow = async () => {
    setActionLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsFollowing(true)

      // Update follower count
      setUserProfile((prev) => ({
        ...prev,
        socialStats: {
          ...prev.socialStats,
          followers: prev.socialStats.followers + 1,
        },
      }))
    } catch (error) {
      console.error("Error following user:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnfollow = async () => {
    setActionLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsFollowing(false)

      // Update follower count
      setUserProfile((prev) => ({
        ...prev,
        socialStats: {
          ...prev.socialStats,
          followers: prev.socialStats.followers - 1,
        },
      }))
    } catch (error) {
      console.error("Error unfollowing user:", error)
    } finally {
      setActionLoading(false)
    }
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
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <h1>{userId}</h1>
      {user.map((post) => (
    <div key={post._id} className="post-card">
    <h2>{post.title}</h2>
    <p>{post.description}</p>
    <p>Price: ₹{post.price} {post.priceUnit}</p>
    <p>Category: {post.category}</p>
    <p>Location: {post.location.city}, {post.location.state}</p>
    <p>Author: {post.author.fullName}</p>
    <img src={post.images[0]} alt={post.title} width={200} />
    <hr />
  </div>
))}

      <p>gberuierbekfweiereriujkdnvdgriuerherfdkrrfgherdkfjsdhbrjkfgerhfgdrfjdbdfgvjdf</p>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <UserProfileHeader
          userProfile={userProfile}
          isOwnProfile={false}
          onStartChat={handleStartChat}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          isFollowing={isFollowing}
          isLoading={actionLoading}
        />

        {/* Profile Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} userProfile={userProfile} isOwnProfile={false} />

        {/* Tab Content */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-6 md:p-8 border border-gray-100 border-t-0">
          {activeTab === "posts" && <UserPosts posts={userPosts} isOwnProfile={false} />}

          {activeTab === "about" && <UserAbout userProfile={userProfile} />}

          {activeTab === "reviews" && <UserReviews userProfile={userProfile} reviews={userReviews} />}
        </div>
      </div>
    </div>
  )
}

export default PublicProfile
