const UserAbout = ({ userProfile }) => {
  return (
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
            { label: "User Type", value: userProfile?.userType, icon: "🏷️" },
            { label: "Member Since", value: new Date(userProfile?.joinedDate).getFullYear(), icon: "📅" },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-sm font-medium text-gray-500">{item.label}</div>
                <div className="text-gray-900 font-medium capitalize">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Information Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
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
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <span className="text-2xl">📍</span>
          <span>Location Details</span>
        </h3>
        <div className="space-y-4">
          {[
            { label: "State", value: userProfile?.location?.state, icon: "🗺️" },
            { label: "District", value: userProfile?.location?.district, icon: "🏘️" },
            { label: "City", value: userProfile?.location?.city, icon: "🏙️" },
            { label: "Pincode", value: userProfile?.location?.pincode, icon: "📮" },
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
  )
}

export default UserAbout
