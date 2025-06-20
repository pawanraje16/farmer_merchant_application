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
import { usePost } from "../context/PostContext"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const navigate = useNavigate()
 

   const {setPosts,isLoading,setIsLoading
  ,filters,mockFeedPosts}=useFeed()
   
  const {fetchPosts,posts} = usePost()
  const {user,loadingAuth} = useAuth();




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
    fetchPosts()
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
