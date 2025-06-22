"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import FeedPost from "../components/FeedPost"
import PostFilters from "../components/PostFilters"
import PageHeader from "../components/PageHeader"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { useFeed } from "../context/FeedContext"
import { usePost } from "../context/PostContext"

const Crops = () => {
  const navigate = useNavigate()
  // const [posts, setPosts] = useState([])
  // const [filteredPosts, setFilteredPosts] = useState([])
  // const [isLoading, setIsLoading] = useState(true)
  // const [filters, setFilters] = useState({
  //   cropType: "all",
  //   location: {
  //     state: "all",
  //     district: "all",
  //   },
  //   priceRange: "all",
  //   availability: "all",
  //   organic: false,
  // })


  const {filteredPosts, setFilteredPosts, isLoading, setIsLoading, filters, setFilters,mockFeedPosts}=useFeed();
  const {posts,fetchPosts} = usePost();

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await fetchPosts()
      } catch (error) {
        console.error("Error loading posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPosts()
  }, [])

   useEffect(() => {
    
    if(!posts ||  posts?.length === 0) return ;
    setIsLoading(true)
    // Apply filters
    const filtered = posts.filter((post) => {
      // Category filter
      if (filters.category !== "all" && post.cropType !== filters.category) return false;

      // Location: State
      if (filters.location.state !== "all" && post.location.state !== filters.location.state)
        return false;

      // Location: District
      if (
        filters.location.district !== "all" &&
        post.location.district !== filters.location.district
      )
        return false;

      // Price range
      if (filters.priceRange !== "all") {
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (max) {
          if (post.price < min || post.price > max) return false;
        } else {
          if (post.price < min) return false;
        }
      }

      // Availability
      if (filters.availability !== "all") {
        if (filters.availability === "available" && !post.isAvailable) return false;
        if (filters.availability === "unavailable" && post.isAvailable) return false;
      }

      // Organic
      if (filters.organic && !post.isOrganic) return false;

      return true;
    });

    setFilteredPosts(filtered);
    setIsLoading(false);
  }, [filters, posts]);


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }



  // const handleChatClick = (authorId) => {
  //   // Navigate to chat with author
  //   navigate(`/chat/${authorId}`)
  // }

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
          stats={[`${filteredPosts?.length ?? 0} Posts Found`]}
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
