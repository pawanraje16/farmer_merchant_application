

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ProductPost from "../components/ProductPost"
import { fruits, proPhoto } from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import LocationCard from "../components/LocationCart";


const Profile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [userProfile, setUserProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editForm, setEditForm] = useState({})
  const [coverUploading, setCoverUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef();
  const {user} =useAuth()

  
  const fetchUserProfile = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("/api/v1/users/profile")
        const {data} =response
        console.log(data);
        if(data?.success)toast.success("userfetched")
        console.log(data.data)
        setUserProfile(data.data)
        // setUserPosts(mockUserPosts)
        setEditForm(mockUserProfile)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }
  
    const fetchUserPosts = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("/api/v1/post/current-posts");
        const {data} = response;
        if(data?.success)toast.success("posts fetched")
        setUserPosts(data.data)
        
      } catch (error) {
        console.error("Error fetching the profile posts", error)
      } finally{
        setIsLoading(false)
      }
    }

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return ;

    // Show local preview instantly
    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);
    setCoverUploading(true);

    const formData = new FormData();
    formData.append("coverImage",file);

    try {
     const {data} =  await api.patch("/api/v1/users/cover-image", formData, {
        headers:  {"Content-Type": "multipart/form-data"},
      });

      //Pre-load cloud image before swapping
      const cloudURL = data.data;
      const img= new Image();
      img.src = cloudURL;

      img.onload = () => {
        setUserProfile((prev) => ({...prev, coverImage: cloudURL}));
        setPreviewImage(null);
        URL.revokeObjectURL(previewURL);
        setCoverUploading(false);
        toast.success("Cover Image updated!");
      };

      img.onerror= () => {
        URL.revokeObjectURL(previewURL);
        setPreviewImage(null);
        setCoverUploading(false);
        toast.error("Failed to load updated image.");
      };      
    } catch (err) {
      toast.error("Upload failed");
      setPreviewImage(null);
      URL.revokeObjectURL(previewURL);
      setCoverUploading(false)
    } 
  };


  useEffect(() => {
    fetchUserProfile()
    fetchUserPosts()
  }, [])

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUserProfile(editForm)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))

    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
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
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Profile Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
          {/* Cover Photo with Gradient Overlay */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white flex items-center justify-center">
          {userProfile?.coverImage ? (
              <img
               src={previewImage || userProfile?.coverImage}
               alt="Cover"
               className="absolute inset-0 w-full h-full object-cover"
               />
            ) :(
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-blue-500"></div>
            )}

              {/* ✅ Loader Overlay */}
              {coverUploading && (
                <div className="absolute inset-0 bg-white/40 flex justify-center items-center z-10">
                  <div className="loader border-4 border-green-600 rounded-full animate-spin h-10 w-10 border-t-transparent"></div>
                </div>
              )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Upload Button  */}

            <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-4 right-4 px-3 py-1 text-sm bg-white text-gray-700 rounded shadow hover:bg-gray-100"
            >
              {userProfile?.coverImage ? "Edit Cover" : " Add Cover"}
            </button>
            <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            ref={fileInputRef}
            className="hidden"
            />
            

            {/* Profile Info Overlay */}
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{userProfile?.fullName}</h1>
              <div className="flex items-center space-x-4 text-green-100">
                <span className="flex items-center space-x-1">
                  <span>@</span>
                  <span>{userProfile?.username}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>
                    {userProfile?.address?.city}, {userProfile?.address?.state}
                  </span>
                </span>
              </div>
            </div>

          </div>

          {/* Profile Content */}
          <div className="px-6 md:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
              {/* Left Side - Profile Photo & Info */}
              <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 p-1">
                    <img
                      src={userProfile?.avatar || "https://images.app.goo.gl/DYXBxqjZX46cbpN4A"}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-3 shadow-lg">
                    <span className="text-2xl">{userProfile?.userType === "farmer" ? "🚜" : "🏪"}</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold capitalize shadow-lg">
                      {userProfile?.userType}
                    </span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <span className="text-lg">⭐</span>
                      <span className="font-bold text-gray-900">{userProfile?.socialStats?.rating}</span>
                      <span className="text-gray-500 text-sm">({userProfile?.socialStats?.totalReviews})</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">{userProfile?.bio}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>Joined {formatDate(userProfile?.createdAt)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>🌾</span>
                      <span>{userProfile?.majorProduct}</span>
                    </span>
                  </div>

                  {/* Achievements */}
                  <div className="flex flex-wrap gap-3">
                    {userProfile?.achievements?.map((achievement, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 px-3 py-2 rounded-xl flex items-center space-x-2 group hover:shadow-md transition-all"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">{achievement.icon}</span>
                        <span className="text-sm font-medium text-gray-800">{achievement.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Stats & Actions */}
              <div className="lg:text-right space-y-6">
                {/* Enhanced Stats */}
                <div className="grid grid-cols-3 gap-6 lg:gap-8">
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                      <div className="text-2xl font-bold">{userProfile?.socialStats?.totalPosts}</div>
                      <div className="text-sm opacity-90">Posts</div>
                    </div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                      <div className="text-2xl font-bold">{userProfile?.socialStats?.followers}</div>
                      <div className="text-sm opacity-90">Followers</div>
                    </div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                      <div className="text-2xl font-bold">{userProfile?.socialStats?.following}</div>
                      <div className="text-sm opacity-90">Following</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    ✏️ Edit Profile
                  </button>
                  <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
                    📤 Share Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <nav className="flex space-x-1 px-6">
              {[
                { id: "posts", label: "My Posts", icon: "📝", count: userProfile?.socialStats?.totalPosts },
                { id: "about", label: "About", icon: "ℹ️" },
                { id: "reviews", label: "Reviews", icon: "⭐", count: userProfile?.socialStats?.totalReviews },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 px-6 font-medium text-sm transition-all duration-300 rounded-t-2xl ${
                    activeTab === tab.id
                      ? "bg-white text-green-600 shadow-lg -mb-px border-t-2 border-green-500"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === "posts" && (
              <div className="space-y-8">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => <ProductPost key={post._id} post={post} />)
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                      <span className="text-6xl">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No posts yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Start sharing your amazing products with the farming community!
                    </p>
                    <button
                      onClick={() => navigate("/create-post")}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      🌾 Create Your First Post
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span className="text-2xl">👤</span>
                    <span>Personal Information</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: userProfile?.fullName, icon: "👨‍🌾" },
                      { label: "Email", value: userProfile?.email, icon: "✉️" },
                      { label: "Phone", value: userProfile?.contact, icon: "📱" },
                      { label: "Aadhaar", value: userProfile?.aadhaarNumber, icon: "🆔" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-500">{item.label}</div>
                          <div className="text-gray-900 font-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Information Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-100">
                  <h3
                    className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2
                    "
                  >
                    <span className="text-2xl">{userProfile?.userType === "farmer" ? "🚜" : "🏢"}</span>
                    <span>{userProfile?.userType === "farmer" ? "Farm Details" : "Business Details"}</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: userProfile?.userType === "farmer" ? "Farm Name" : "Business Name",
                        value: userProfile?.businessDetails?.businessName,
                        icon: "🏪",
                      },
                      { label: "Specialization", value: userProfile?.majorProduct, icon: "🌾" },
                      { label: "Farm Size", value: userProfile?.farmDetails?.farmSize, icon: "📏" },
                      { label: "Experience", value: userProfile?.farmDetails?.experience, icon: "⏰" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-500">{item.label}</div>
                          <div className="text-gray-900 font-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Information Card */}
               <LocationCard
               userProfile={userProfile}
               refreshProfile={fetchUserProfile}
               />

                {/* Certifications Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border border-yellow-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span className="text-2xl">🏆</span>
                    <span>Certifications & Achievements</span>
                  </h3>
                  <div className="space-y-3">
                    {userProfile?.farmDetails?.certifications?.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xl">✅</span>
                        <div className="text-gray-900 font-medium">{cert}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                  <span className="text-6xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews & Ratings</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Reviews from customers will appear here to build trust and credibility
                </p>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 max-w-md mx-auto border border-yellow-200">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{userProfile?.socialStats?.rating}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${i < Math.floor(userProfile?.socialStats?.rating) ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600">
                    Based on <span className="font-semibold">{userProfile?.socialStats?.totalReviews}</span> reviews
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span className="text-3xl">✏️</span>
                  <span>Edit Profile</span>
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Major Product</label>
                    <input
                      type="text"
                      name="majorProduct"
                      value={editForm.majorProduct || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="contactInfo.phone"
                      value={editForm.contactInfo?.phone || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Business Name</label>
                    <input
                      type="text"
                      name="businessDetails.businessName"
                      value={editForm.businessDetails?.businessName || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={editForm.bio || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    {isLoading ? "Saving..." : "💾 Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
