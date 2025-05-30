"use client"

import { useState } from "react"

const UserProfileHeader = ({
  userProfile,
  isOwnProfile = false,
  onEditProfile,
  onStartChat,
  onFollow,
  onUnfollow,
  isFollowing = false,
  isLoading = false,
}) => {
  const [showContactInfo, setShowContactInfo] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
      {/* Cover Photo with Gradient Overlay */}
      <div className="relative h-64 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-blue-500"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Floating Elements */}
        <div className="absolute top-6 right-6 flex space-x-2">
          {userProfile?.isOnline && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 backdrop-blur-sm bg-opacity-90">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          )}
          {userProfile?.isVerified && (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-opacity-90">
              ✓ Verified
            </div>
          )}
        </div>

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
                {userProfile?.location?.city}, {userProfile?.location?.state}
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
                  src={userProfile?.profilePhoto || "/placeholder.svg?height=160&width=160"}
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
                  <span>Joined {formatDate(userProfile?.joinedDate)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🌾</span>
                  <span>{userProfile?.majorProduct}</span>
                </span>
                {!isOwnProfile && (
                  <button
                    onClick={() => setShowContactInfo(!showContactInfo)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium"
                  >
                    <span>📞</span>
                    <span>{showContactInfo ? "Hide Contact" : "Show Contact"}</span>
                  </button>
                )}
              </div>

              {/* Contact Info - Only show to others when requested */}
              {!isOwnProfile && showContactInfo && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span>📱</span>
                    <span className="font-medium">Phone:</span>
                    <span>{userProfile?.contactInfo?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💬</span>
                    <span className="font-medium">WhatsApp:</span>
                    <span>{userProfile?.contactInfo?.whatsapp}</span>
                  </div>
                </div>
              )}

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
              {isOwnProfile ? (
                <>
                  <button
                    onClick={onEditProfile}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    ✏️ Edit Profile
                  </button>
                  <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
                    📤 Share Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onStartChat}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium disabled:opacity-50"
                  >
                    💬 Start Chat
                  </button>
                  <button
                    onClick={isFollowing ? onUnfollow : onFollow}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium disabled:opacity-50 ${
                      isFollowing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                    }`}
                  >
                    {isFollowing ? "✓ Following" : "➕ Follow"}
                  </button>
                  <button className="px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
                    ⚠️
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileHeader
