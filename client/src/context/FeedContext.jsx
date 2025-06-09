import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // use fetch if you prefer

const FeedContext = createContext();
export const useFeed = () => useContext(FeedContext);

export const FeedProvider = ({ children }) => {
  // const navigate = useNavigate();

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

   const mockPublicProfile = [
   { _id: "user456",
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
    lastActive: "2024-01-14T18:45:00Z",},

    {
  _id: "user789",
  username: "wheat_buyer_rajesh",
  email: "rajesh@grainbuyers.in",
  userType: "merchant",
  majorProduct: "Bulk Grain Procurement",
  profilePhoto: "/placeholder.svg?height=150&width=150",
  coverPhoto: "/placeholder.svg?height=300&width=800",
  fullName: "Rajesh Jain",
  location: {
    state: "Rajasthan",
    district: "Jaipur",
    city: "Jaipur",
    pincode: "302001"
  },
  bio: "📦 Buying premium-grade wheat, rice & millet from verified farmers across India. Transparency and fair pricing guaranteed.",
  farmDetails: {
    farmSize: "N/A",
    farmingType: "Bulk Merchant",
    experience: "10 years",
    certifications: ["FSSAI Licensed", "ISO Certified Buyer"]
  },
  businessDetails: {
    businessName: "Rajesh Agro Pvt Ltd",
    gstNumber: "GST192837465",
    businessType: "Private Limited"
  },
  contactInfo: {
    phone: "9833445566",
    whatsapp: "9833445566",
    alternatePhone: "9944556677"
  },
  socialStats: {
    totalPosts: 25,
    followers: 4320,
    following: 302,
    rating: 4.5,
    totalReviews: 218
  },
  achievements: [
    { title: "Trusted Buyer", icon: "🤝", description: "Fair deals with 100+ farmers" },
    { title: "Bulk Partner", icon: "📦", description: "Consistent procurement volumes" }
  ],
  joinedDate: "2020-06-10",
  isVerified: true,
  isOnline: false,
  lastActive: "2025-06-07T16:30:00Z"
},
{
  _id: "user982",
  username: "egg_farm_jose",
  email: "jose@freerangeeggs.com",
  userType: "farmer",
  majorProduct: "Country Eggs, Poultry Products",
  profilePhoto: "/placeholder.svg?height=150&width=150",
  coverPhoto: "/placeholder.svg?height=300&width=800",
  fullName: "Jose Mathew",
  location: {
    state: "Kerala",
    district: "Ernakulam",
    city: "Kochi",
    pincode: "682001"
  },
  bio: "🥚 Supplying fresh, protein-rich eggs from healthy free-range hens. Delivering trust with every tray.",
  farmDetails: {
    farmSize: "2 acres",
    farmingType: "Free-range Poultry",
    experience: "5+ years",
    certifications: ["Animal Welfare Certified"]
  },
  businessDetails: {
    businessName: "Mathew’s Egg Farm",
    gstNumber: "GST564738291",
    businessType: "Individual"
  },
  contactInfo: {
    phone: "9988776655",
    whatsapp: "9988776655",
    alternatePhone: "9123456789"
  },
  socialStats: {
    totalPosts: 7,
    followers: 1320,
    following: 98,
    rating: 4.3,
    totalReviews: 89
  },
  achievements: [
    { title: "Healthy Farming", icon: "🍳", description: "No antibiotics or chemicals used" },
    { title: "Protein Supplier", icon: "🥚", description: "Reliable source of nutrition" }
  ],
  joinedDate: "2022-08-05",
  isVerified: true,
  isOnline: true,
  lastActive: "2025-06-09T09:05:00Z"
},
{
  _id: "user401",
  username: "dairy_farm_ali",
  email: "ali@puremilkfarm.com",
  userType: "farmer",
  majorProduct: "Buffalo Milk, Dairy Products",
  profilePhoto: "/placeholder.svg?height=150&width=150",
  coverPhoto: "/placeholder.svg?height=300&width=800",
  fullName: "Ali Khan",
  location: {
    state: "Uttar Pradesh",
    district: "Meerut",
    city: "Meerut",
    pincode: "250001"
  },
  bio: "🥛 Delivering farm-fresh buffalo milk every morning. High-fat content and full cream goodness. Trusted by 500+ families.",
  farmDetails: {
    farmSize: "5 acres",
    farmingType: "Dairy",
    experience: "9 years",
    certifications: ["Certified Dairy Producer", "Cold Chain Maintained"]
  },
  businessDetails: {
    businessName: "Ali’s Dairy Farm",
    gstNumber: "GST872736182",
    businessType: "Sole Proprietor"
  },
  contactInfo: {
    phone: "9988007766",
    whatsapp: "9988007766",
    alternatePhone: "9345678910"
  },
  socialStats: {
    totalPosts: 12,
    followers: 1650,
    following: 110,
    rating: 4.1,
    totalReviews: 77
  },
  achievements: [
    { title: "Top Milk Quality", icon: "🥛", description: "100% pure, no additives" },
    { title: "Daily Delivery Champ", icon: "🚚", description: "Punctual milk delivery service" }
  ],
  joinedDate: "2020-02-11",
  isVerified: true,
  isOnline: false,
  lastActive: "2025-06-08T21:40:00Z"
},
  ]

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
        mockPublicProfile,
        mockPublicPosts,
        mockReviews,
        
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
