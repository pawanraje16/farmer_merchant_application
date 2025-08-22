// src/components/ChatList.js

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useChat } from "../context/ChatContext"

const ChatList = () => {
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const { getUsers, users, setSelectedUser, unseenMessages, setUnseenMessages } = useChat()

  // 1. Define the AI assistant chat object here
  const aiAssistantChat = {
    _id: "agro-assistant",
    userId: "agro-assistant",
    fullName: "AgroConnect Assistant",
    username: "agro-assistant",
    avatar: "client\public\logo.png", // Use a unique AI icon
    lastMessage: "I can help with crop prices, weather, and more!",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
    isOnline: true,
    userType: "AI",
    isAI: true, // This flag is crucial for filtering and styling
  }

  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true)
      try {
        await getUsers() // Wait for users to load
      } catch (error) {
        console.error("Error loading chats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadChats()
  }, [])

  useEffect(() => {
    // 2. Prepend the AI chat to the list of users
    if (users.length > 0) {
      const mappedChats = users.map((user) => ({
        _id: user._id,
        userId: user._id,
        fullName: user.fullName || "Unnamed",
        avatar: user.avatar || "/placeholder.svg?height=50&width=50",
        lastMessage: "Start a conversation 👋",
        lastMessageTime: user.createdAt || new Date().toISOString(),
        isOnline: user.isOnline || false,
        userType: user.userType || "merchant",
        username: user.username,
      }))
      setChats([aiAssistantChat, ...mappedChats])
    } else {
      // If there are no other users, still show the AI assistant
      setChats([aiAssistantChat])
    }
  }, [users])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "now"
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInHours < 48) return "yesterday"
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  }

  // 3. Update filtering and sorting logic
  const filteredChats = chats
    .filter((chat) => chat.isAI || chat.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (a.isAI === b.isAI ? 0 : a.isAI ? -1 : 1))

  // This part is for the total unread count and needs to be updated.
  // The AI chat won't have unread messages.
  const totalUnreadCount = chats.reduce((total, chat) => total + (unseenMessages[chat._id] || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading chats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 border border-gray-100">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <span className="text-4xl">💬</span>
                  <span>Messages</span>
                </h1>
                {totalUnreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    {totalUnreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate("/market")}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                + Find Users
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-xl">🔍</span>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-lg">✕</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {filteredChats.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredChats.map((chat, index) => (
                <div
                  key={chat._id}
                  onClick={() => {
                    setSelectedUser(chat)
                    navigate(`/chat/${chat.username}`)
                  }}
                  className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 group ${
                    index === 0 ? "rounded-t-3xl" : ""
                  } ${index === filteredChats.length - 1 ? "rounded-b-3xl" : ""}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={chat.avatar || "/placeholder.svg?height=50&width=50"}
                        alt={chat.fullName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=50&width=50"
                        }}
                      />
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-semibold truncate ${chat.unreadCount > 0 ? "text-gray-900" : "text-gray-700"}`}
                        >
                          {chat.fullName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                          {unseenMessages[chat._id] > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-bold animate-pulse">
                              {unseenMessages[chat._id]}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate flex-1 mr-2 ${
                            unseenMessages[chat._id] > 0 ? "text-gray-900 font-medium" : "text-gray-600"
                          }`}
                        >
                          {chat.lastMessage}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1 ${
                            chat.userType === "farmer"
                              ? "bg-green-100 text-green-800"
                              : chat.userType === "AI"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <span>
                            {chat.userType === "farmer"
                              ? "🚜"
                              : chat.userType === "AI"
                              ? "🤖"
                              : "🏪"}
                          </span>
                          <span className="capitalize">{chat.userType}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchQuery ? "No chats found" : "No conversations yet"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                {searchQuery
                  ? "Try searching with a different name"
                  : "Start connecting with farmers and merchants to begin conversations"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/market")}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  🌾 Explore AgroConnect
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {filteredChats.length > 0 && (
          <div className="mt-6 bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/market")}
                className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">🌾</span>
                <div className="text-left">
                  <div className="font-medium text-green-800">Find Farmers</div>
                  <div className="text-sm text-green-600">Discover new suppliers</div>
                </div>
              </button>
              <button
                onClick={() => navigate("/market")}
                className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">🏪</span>
                <div className="text-left">
                  <div className="font-medium text-blue-800">Find Merchants</div>
                  <div className="text-sm text-blue-600">Connect with buyers</div>
                </div>
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
                <div className="text-left">
                  <div className="font-medium text-purple-800">My Profile</div>
                  <div className="text-sm text-purple-600">Update your info</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatList