import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // use fetch if you prefer

const FeedContext = createContext();
export const useFeed = () => useContext(FeedContext);

export const FeedProvider = ({ children }) => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    location: {
      state: "all",
      district: "all",
    },
    priceRange: "all",
    availability: "all",
    organic: false,
  })
  const [filteredPosts, setFilteredPosts] = useState([])
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




  // ✅ Common data fetch
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/posts'); // Adjust your endpoint
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePostClick = (postId) => navigate(`/post/${postId}`);
  const handleAuthorClick = (authorId) => navigate(`/profile/${authorId}`);
  const handleChatClick = (userId) => navigate(`/chat/${userId}`);
  const handleCreatePost = () => navigate(`/create-post`);

  return (
    <FeedContext.Provider
      value={{
        posts,
        setPosts,
        isLoading,
        filters,
        setFilters,
        setIsLoading,
        filteredPosts,
        setFilteredPosts,
        fetchPosts,
        handleFilterChange,
        handlePostClick,
        handleAuthorClick,
        handleChatClick,
        handleCreatePost,
        mockFeedPosts,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
