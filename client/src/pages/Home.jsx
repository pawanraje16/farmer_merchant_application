// "use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import FeedPost from "../components/FeedPost"
import CreatePostPrompt from "../components/CreatePostPrompt"
import PostFilters from "../components/PostFilters"
import PageHeader from "../components/PageHeader"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { useFeed } from "../context/FeedContext"

const Home = () => {
  const navigate = useNavigate()
  // const [posts, setPosts] = useState([])
  // const [isLoading, setIsLoading] = useState(true)
  // const [filters, setFilters] = useState({
  //   category: "all",
  //   location: "all",
  //   priceRange: "all",
  //   sortBy: "latest",
  // })

   const {posts,setPosts,isLoading,setIsLoading,handlePostClick,
    handleAuthorClick,
    handleChatClick,filters}=useFeed()





  // Mock feed data with diverse posts from different users
  const mockFeedPosts = [
    {
      _id: "feed_post_1",
      title: "Premium Organic Basmati Rice - Farm Fresh",
      description:
        "Freshly harvested premium basmati rice from my organic farm. No chemicals, no pesticides. Perfect for healthy cooking and special occasions.",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      price: 85,
      priceUnit: "per kg",
      originalPrice: 95,
      category: "Grains",
      quantity: "500 kg available",
      location: {
        state: "Punjab",
        district: "Karmad",
        city: "Karmad",
      },
      isAvailable: true,
      isFeatured: true,
      createdAt: "2024-01-15T08:00:00Z",
      likes: 45,
      comments: 12,
      views: 234,
      tags: ["organic", "premium", "basmati"],
      author: {
        _id: "user123",
        username: "farmer_raj",
        fullName: "Raj Kumar Singh",
        profilePhoto: "/placeholder.svg?height=50&width=50",
        userType: "farmer",
        isVerified: true,
        rating: 4.8,
      },
    },
    {
      _id: "feed_post_2",
      title: "Fresh Organic Spinach - Iron Rich",
      description:
        "Freshly harvested organic spinach from our farm. Rich in iron, vitamins, and minerals. Perfect for healthy cooking and salads.",
      images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
      price: 40,
      priceUnit: "per kg",
      originalPrice: null,
      category: "Vegetables",
      quantity: "80 kg available",
      location: {
        state: "Maharashtra",
        district: "Ladgao",
        city: "Ladgao",
      },
      isAvailable: true,
      isFeatured: true,
      createdAt: "2024-01-15T06:30:00Z",
      likes: 89,
      comments: 23,
      views: 456,
      tags: ["organic", "spinach", "iron-rich", "healthy"],
      author: {
        _id: "user456",
        username: "organic_farmer_priya",
        fullName: "Priya Sharma",
        profilePhoto: "/placeholder.svg?height=50&width=50",
        userType: "farmer",
        isVerified: true,
        rating: 4.9,
      },
    },
    {
      _id: "feed_post_3",
      title: "Looking for Bulk Wheat Purchase - 1000kg",
      description:
        "Need high-quality wheat for my flour mill. Looking for 1000kg monthly supply. Prefer organic or naturally grown wheat. Good rates assured.",
      images: ["/placeholder.svg?height=400&width=600"],
      price: 25,
      priceUnit: "per kg (negotiable)",
      originalPrice: null,
      category: "Grains",
      quantity: "1000 kg needed monthly",
      location: {
        state: "Haryana",
        district: "Karnal",
        city: "Karnal",
      },
      isAvailable: true,
      isFeatured: false,
      createdAt: "2024-01-14T18:45:00Z",
      likes: 34,
      comments: 18,
      views: 267,
      tags: ["wheat", "bulk", "purchase", "mill"],
      author: {
        _id: "user789",
        username: "wheat_trader_amit",
        fullName: "Amit Kumar",
        profilePhoto: "/placeholder.svg?height=50&width=50",
        userType: "merchant",
        isVerified: true,
        rating: 4.6,
      },
    },
    {
      _id: "feed_post_4",
      title: "Fresh Farm Eggs - Free Range",
      description:
        "Fresh eggs from our free-range chickens. The chickens roam freely and eat natural feed. Rich in protein and completely natural.",
      images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
      price: 8,
      priceUnit: "per piece",
      originalPrice: null,
      category: "Poultry",
      quantity: "200 eggs available daily",
      location: {
        state: "Karnataka",
        district: "Bangalore Rural",
        city: "Bangalore",
      },
      isAvailable: true,
      isFeatured: false,
      createdAt: "2024-01-14T14:20:00Z",
      likes: 67,
      comments: 15,
      views: 189,
      tags: ["eggs", "free-range", "fresh", "daily", "protein"],
      author: {
        _id: "user101",
        username: "poultry_farm_sunita",
        fullName: "Sunita Patel",
        profilePhoto: "/placeholder.svg?height=50&width=50",
        userType: "farmer",
        isVerified: false,
        rating: 4.7,
      },
    },
    {
      _id: "feed_post_5",
      title: "Seasonal Mixed Vegetables Box",
      description:
        "Fresh seasonal vegetables box containing potatoes, onions, carrots, cabbage, and green beans. All organically grown on our farm.",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      price: 250,
      priceUnit: "per box (5kg)",
      originalPrice: 300,
      category: "Vegetables",
      quantity: "30 boxes available",
      location: {
        state: "Tamil Nadu",
        district: "Coimbatore",
        city: "Coimbatore",
      },
      isAvailable: true,
      isFeatured: false,
      createdAt: "2024-01-14T11:30:00Z",
      likes: 23,
      comments: 6,
      views: 145,
      tags: ["vegetables", "mixed", "seasonal", "family", "box"],
      author: {
        _id: "user202",
        username: "veggie_farmer_ravi",
        fullName: "Ravi Krishnan",
        profilePhoto: "/placeholder.svg?height=50&width=50",
        userType: "farmer",
        isVerified: true,
        rating: 4.5,
      },
    },
    {
      _id: "feed_post_6",
      title: "Seeking Organic Tomato Suppliers",
      description:
        "Restaurant chain looking for consistent organic tomato suppliers. Need 200kg weekly. Premium rates for quality produce. Long-term partnership.",
      images: ["/placeholder.svg?height=400&width=600"],
      price: 60,
      priceUnit: "per kg (offering)",
      originalPrice: null,
      category: "Vegetables",
      quantity: "200 kg needed weekly",
      location: {
        state: "Delhi",
        district: "New Delhi",
        city: "New Delhi",
      },
      isAvailable: true,
      isFeatured: true,
      createdAt: "2024-01-13T16:15:00Z",
      likes: 78,
      comments: 34,
      views: 512,
      tags: ["tomatoes", "organic", "restaurant", "bulk", "partnership"],
      author: {
        _id: "user303",
        username: "restaurant_buyer_meera",
        fullName: "Meera Gupta",
        profilePhoto: "/placeholder.svg?height=50&width=50",
        userType: "merchant",
        isVerified: true,
        rating: 4.8,
      },
    },
  ]

  useEffect(() => {
    const loadFeedPosts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPosts(mockFeedPosts)
      } catch (error) {
        console.error("Error loading feed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeedPosts()
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // In real app, this would trigger API call with filters
    console.log("Applying filters:", newFilters)
  }

  // const handlePostClick = (post) => {
  //   // Navigate to the post detail page
  //   navigate(`/post/${post._id}`)
  // }

  const handleCreatePost = () => {
    navigate("/create-post")
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading your feed..." icon="🌾" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <PageHeader
          title="Welcome to AgroConnect"
          subtitle="Discover fresh products and connect with farmers & merchants across India"
          icon="🌾"
          stats={[`${posts.length} Active Posts`]}
          actions={[{ label: "+ Create Post", onClick: handleCreatePost }]}
        />

        {/* Create Post Prompt */}
        {/* <CreatePostPrompt onCreatePost={handleCreatePost} /> */}

        {/* Filters */}
        <PostFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Feed Posts */}
        <div className="space-y-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <FeedPost
                key={post._id}
                post={post}
                onPostClick={() => handlePostClick(post._id)}
                onAuthorClick={() => navigate(`/user/${post.author._id}`)}
                onChatClick={() => navigate(`/chat/${post.author._id}`)}
              />
            ))
          ) : (
            <EmptyState
              title="No posts available"
              message="Be the first to share your products with the AgroConnect community!"
              icon="📝"
              actionLabel="🌾 Create Your First Post"
              onAction={handleCreatePost}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
