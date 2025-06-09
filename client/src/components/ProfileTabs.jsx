
const ProfileTabs = ({ activeTab, setActiveTab, userProfile, isOwnProfile = false }) => {
  const tabs = [
    { id: "posts", label: "Posts", icon: "📝", count: userProfile?.socialStats?.totalPosts },
    { id: "about", label: "About", icon: "ℹ️" },
    { id: "reviews", label: "Reviews", icon: "⭐", count: userProfile?.socialStats?.totalReviews },
  ]

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
        <nav className="flex space-x-1 px-6">
          {tabs.map((tab) => (
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
    </div>
  )
}

export default ProfileTabs
