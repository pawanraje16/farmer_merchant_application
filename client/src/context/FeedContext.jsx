import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // use fetch if you prefer
import { proPhoto, fruits } from '../assets/assets';


axios.defaults.withCredentials = true,
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const FeedContext = createContext();
export const useFeed = () => useContext(FeedContext);

export const FeedProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFarmer, setIsFarmer] = useState(false);
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
        axios,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
