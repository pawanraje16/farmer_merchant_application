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
            _id: "feed_post_7",
            title: "Organic Carrots - Freshly Harvested",
            description: "Crunchy, sweet organic carrots straight from the farm. No chemicals, just natural goodness.",
            images: ["/placeholder.svg?height=400&width=600"],
            price: 35,
            priceUnit: "per kg",
            originalPrice: null,
            category: "Vegetables",
            cropType: "Carrot",
            quantity: "100 kg available",
            location: {
              state: "Himachal Pradesh",
              district: "Shimla",
              city: "Shimla",
              pincode: "171001",
              address: "Village Narkanda, Near Old Market",
            },
            isAvailable: true,
            isFeatured: false,
            isOrganic: true,
            createdAt: "2024-05-01T10:00:00Z",
            likes: 31,
            comments: 7,
            views: 110,
            tags: ["organic", "carrot", "vegetables"],
            specifications: {
              variety: "Pusa Rudhira",
              harvestDate: "April 2024",
              shelfLife: "1 month",
              minOrderQuantity: "10 kg",
              packaging: "Loose or 10kg bag"
            },
            author: {
              _id: "user345",
              username: "carrot_farm_amit",
              fullName: "Amit Rana",
              profilePhoto: "/placeholder.svg",
              userType: "farmer",
              isVerified: true,
              rating: 4.2,
              totalReviews: 45,
              location: "Shimla, HP",
              memberSince: "2023"
            }
          },
          {
            _id: "feed_post_8",
            title: "Looking for High-Quality Wheat - 2000 kg Required",
            description: "We are looking to buy 2000 kg of wheat per month for our processing unit. Only premium quality accepted.",
            images: [],
            price: 28,
            priceUnit: "per kg (negotiable)",
            originalPrice: null,
            category: "Grains",
            cropType: "Wheat",
            quantity: "2000 kg monthly",
            location: {
              state: "Rajasthan",
              district: "Jaipur",
              city: "Jaipur",
              pincode: "302001",
              address: "Industrial Area, Near Grain Depot",
            },
            isAvailable: true,
            isFeatured: true,
            isOrganic: false,
            postType: "buy",
            createdAt: "2024-05-10T09:00:00Z",
            likes: 12,
            comments: 3,
            views: 200,
            tags: ["bulk", "wheat", "buyer", "rajasthan"],
            author: {
              _id: "user789",
              username: "wheat_buyer_rajesh",
              fullName: "Rajesh Jain",
              profilePhoto: "/placeholder.svg",
              userType: "merchant",
              isVerified: true,
              rating: 4.5,
              totalReviews: 33,
              location: "Jaipur, Rajasthan",
              memberSince: "2021"
            }
          },
          {
            _id: "feed_post_9",
            title: "Farm Fresh Country Eggs - High Protein",
            description: "Daily supply of country eggs from healthy free-range hens. Perfect for health-conscious families.",
            images: ["/placeholder.svg"],
            price: 9,
            priceUnit: "per piece",
            originalPrice: null,
            category: "Poultry",
            quantity: "300 eggs daily",
            location: {
              state: "Kerala",
              district: "Ernakulam",
              city: "Kochi",
              pincode: "682001",
              address: "Kalamassery, Near Market Junction",
            },
            isAvailable: true,
            isFeatured: false,
            isOrganic: true,
            createdAt: "2024-05-12T08:00:00Z",
            likes: 54,
            comments: 9,
            views: 173,
            tags: ["eggs", "poultry", "free-range", "kerala"],
            specifications: {
              shellColor: "Brown",
              size: "Medium",
              packaging: "30 pcs trays",
              shelfLife: "7 days"
            },
            author: {
              _id: "user982",
              username: "egg_farm_jose",
              fullName: "Jose Mathew",
              profilePhoto: "/placeholder.svg",
              userType: "farmer",
              isVerified: true,
              rating: 4.3,
              totalReviews: 27,
              location: "Kochi, Kerala",
              memberSince: "2022"
            }
          },
          {
            _id: "feed_post_10",
            title: "Buffalo Milk - 100% Pure, Full Cream",
            description: "Unprocessed, fresh buffalo milk delivered daily from local dairy. High in nutrients and safe for children.",
            images: ["/placeholder.svg"],
            price: 60,
            priceUnit: "per litre",
            category: "Dairy",
            quantity: "200 litres daily",
            location: {
              state: "Uttar Pradesh",
              district: "Meerut",
              city: "Meerut",
              pincode: "250001",
              address: "Dairy Colony, Phase 2",
            },
            isAvailable: true,
            isFeatured: true,
            isOrganic: false,
            createdAt: "2024-05-14T06:30:00Z",
            likes: 21,
            comments: 5,
            views: 98,
            tags: ["milk", "buffalo", "dairy", "fresh"],
            specifications: {
              fatContent: "6.5%",
              shelfLife: "2 days (unpasteurized)",
              packaging: "Reusable glass bottles or plastic pouches",
              deliveryTime: "Every morning between 6-8 AM"
            },
            author: {
              _id: "user401",
              username: "dairy_farm_ali",
              fullName: "Ali Khan",
              profilePhoto: "/placeholder.svg",
              userType: "farmer",
              isVerified: true,
              rating: 4.1,
              totalReviews: 19,
              location: "Meerut, UP",
              memberSince: "2020"
            }
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
        mockFeedPosts,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
