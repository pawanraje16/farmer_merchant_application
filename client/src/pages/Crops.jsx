"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import FeedPost from "../components/FeedPost"
import PostFilters from "../components/PostFilters"
import PageHeader from "../components/PageHeader"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"

const Crops = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    cropType: "all",
    location: {
      state: "all",
      district: "all",
    },
    priceRange: "all",
    availability: "all",
    organic: false,
  })

  // Mock posts data - same as home feed but with more crop details
  const mockPostsData = [
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
      cropType: "Rice",
      quantity: "500 kg available",
      location: {
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
      },
      isAvailable: true,
      isFeatured: true,
      isOrganic: true,
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
      cropType: "Leafy Vegetables",
      quantity: "80 kg available",
      location: {
        state: "Maharashtra",
        district: "Pune",
        city: "Pune",
      },
      isAvailable: true,
      isFeatured: true,
      isOrganic: true,
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
      cropType: "Wheat",
      quantity: "1000 kg needed monthly",
      location: {
        state: "Haryana",
        district: "Karnal",
        city: "Karnal",
      },
      isAvailable: true,
      isFeatured: false,
      isOrganic: false,
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
      cropType: "Eggs",
      quantity: "200 eggs available daily",
      location: {
        state: "Karnataka",
        district: "Bangalore Rural",
        city: "Bangalore",
      },
      isAvailable: true,
      isFeatured: false,
      isOrganic: true,
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
      cropType: "Mixed Vegetables",
      quantity: "30 boxes available",
      location: {
        state: "Tamil Nadu",
        district: "Coimbatore",
        city: "Coimbatore",
      },
      isAvailable: true,
      isFeatured: false,
      isOrganic: true,
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
      cropType: "Tomatoes",
      quantity: "200 kg needed weekly",
      location: {
        state: "Delhi",
        district: "New Delhi",
        city: "New Delhi",
      },
      isAvailable: true,
      isFeatured: true,
      isOrganic: true,
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
    const loadPosts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPosts(mockPostsData)
        setFilteredPosts(mockPostsData)
      } catch (error) {
        console.error("Error loading posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  useEffect(() => {
    // Apply filters
    const filtered = posts.filter((post) => {
      // Crop type filter
      if (filters.cropType !== "all" && post.category !== filters.cropType) {
        return false
      }

      // Location filter
      if (filters.location.state !== "all" && post.location.state !== filters.location.state) {
        return false
      }

      if (filters.location.district !== "all" && post.location.district !== filters.location.district) {
        return false
      }

      // Price range filter
      if (filters.priceRange !== "all") {
        const [min, max] = filters.priceRange.split("-").map(Number)
        if (max) {
          if (post.price < min || post.price > max) return false
        } else {
          if (post.price < min) return false
        }
      }

      // Availability filter
      if (filters.availability !== "all") {
        if (filters.availability === "available" && !post.isAvailable) return false
        if (filters.availability === "sold-out" && post.isAvailable) return false
      }

      // Organic filter
      if (filters.organic && !post.isOrganic) {
        return false
      }

      return true
    })

    setFilteredPosts(filtered)
  }, [filters, posts])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handlePostClick = (post) => {
    // Navigate to post detail view first
    navigate(`/post/${post._id}`)
  }

  const handleAuthorClick = (authorId) => {
    // Navigate to author profile
    navigate(`/user/${authorId}`)
  }

  const handleChatClick = (authorId) => {
    // Navigate to chat with author
    navigate(`/chat/${authorId}`)
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading crops data..." icon="🌾" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <PageHeader
          title="Crops & Produce"
          subtitle="Find exactly what you're looking for by crop type and location"
          icon="🌾"
          stats={[`${filteredPosts.length} Posts Found`]}
        />

        {/* Filters */}
        <PostFilters filters={filters} onFilterChange={handleFilterChange} showCropSpecificFilters={true} />

        {/* Posts */}
        <div className="space-y-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <FeedPost
                key={post._id}
                post={post}
                onPostClick={() => handlePostClick(post)}
                onAuthorClick={() => handleAuthorClick(post.author._id)}
                onChatClick={() => handleChatClick(post.author._id)}
              />
            ))
          ) : (
            <EmptyState
              title="No posts found"
              message="Try adjusting your filters to find more crops in your area"
              icon="🔍"
              actionLabel="Clear All Filters"
              onAction={() =>
                handleFilterChange({
                  cropType: "all",
                  location: { state: "all", district: "all" },
                  priceRange: "all",
                  availability: "all",
                  organic: false,
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Crops
