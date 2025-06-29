
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import UserProfileHeader from "../components/UserProfileHeader"
import ProfileTabs from "../components/ProfileTabs"
import UserPosts from "../components/UserPosts"
import UserAbout from "../components/UserAbout"
import UserReviews from "../components/UserReviews"
import { useFeed } from "../context/FeedContext"
import { usePost } from "../context/PostContext"
import toast from "react-hot-toast"
import api from "../utils/api"

const PublicProfile = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("posts")
  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("");
  console.log('[PublicProfile] username param =>', username);

  //debuggig
  const {mockFeedPosts,mockPublicProfile,mockPublicPosts,mockReviews}=useFeed();
  const {posts} = usePost()
  
      const fetchUserProfile = async () => {
      setIsLoading(true)
      try {
         const { data } = await api.get(
        `/api/v1/users/user/${encodeURIComponent(username)}`
      );

      // backend replies →  { success: true, data: {...user profile...} }
      if (!data?.success || !data?.data) {
        setError('User profile not found.');
        setUserProfile(null);
        setUserPosts([]);
        setUserReviews([]);
        return;
      }
        setUserProfile(data.data)
        setIsFollowing(data?.data?.isFollowing)
        setUserReviews(mockReviews)

        // Check if current user is following this user
        // This would come from your backend
      
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchuserPosts = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get(`/api/v1/post/user-posts/${username}`);
        
        if(data?.success) {
          setUserPosts(data.data);
        }
        else{
          toast.error(data?.message || "Failed to fetch posts")
        }
        
      } catch (error) {
        toast.error("error while fetching the posts"+error.message)
      }
      finally{
        setIsLoading(false);
      }
    }

    const isFollow = async () => {
      // call api get status of the follow or not and set in the state
      // setIsFollowing= api.get('api/v1/follow/username')
    }

  useEffect(() => {
    fetchUserProfile()
    fetchuserPosts()
    // we have to update the isFollowing or not call api are you following or not

  }, [username,isFollowing,error])

  const handleStartChat = async () => {
    setActionLoading(true)
    try {
      // Simulate API call to create/get chat
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Navigate to chat with this user
      navigate(`/chat/${username}`)
    } catch (error) {
      console.error("Error starting chat:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleFollow = async () => {
  setActionLoading(true);
  try {
    const { data } = await api.post(`/api/v1/follow/follow/${username}`);

    if (data?.success) {
      toast.success("You are now following this user!");
      setIsFollowing(true);

      // Update UI follower count
       setUserProfile((prev) => ({
        ...prev,
        followersCount: (prev?.followersCount || 0) + 1,
      }));
      
    } else {
      toast.error(data?.message || "Failed to follow user.");
    }
  } catch (error) {
    console.error("Error following user:", error);
    toast.error("Something went wrong while following.");
  } finally {
    setActionLoading(false);
  }
};


  const handleUnfollow = async () => {
    setActionLoading(true)
    try {
      // Simulate API call
     
      const { data } = await api.delete(`/api/v1/follow/unfollow/${username}`);
      if(data.success)
      setIsFollowing(false)

      // Update follower count
     setUserProfile((prev) => ({
        ...prev,
        followersCount: Math.max(0, (prev?.followersCount || 1) - 1),
      }));
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

  if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            navigate('/');
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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

       <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
         {/* Profile Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} userProfile={userProfile} isOwnProfile={false} />

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === "posts" &&  <UserPosts posts={userPosts} isOwnProfile={false} />}

          {activeTab === "about" && <UserAbout userProfile={userProfile} />}

          {activeTab === "reviews" && <UserReviews userProfile={userProfile} reviews={userReviews} />}
        </div>
       </div>
      </div>
    </div>
  )
}

export default PublicProfile
