"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"

const ChatInterface = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [chatUser, setChatUser] = useState(null)
  const [isTyping, setIsTyping] = useState(false)

  // Mock chat user data
  const mockChatUser = {
    _id: "user456",
    username: "organic_farmer_priya",
    fullName: "Priya Sharma",
    profilePhoto: "/placeholder.svg?height=50&width=50",
    isOnline: true,
    lastSeen: "2024-01-15T10:30:00Z",
    userType: "farmer",
  }

  // Mock messages
  const mockMessages = [
    {
      _id: "msg1",
      senderId: "user456",
      receiverId: "currentUser",
      message: "Hi! I saw your interest in organic vegetables. I have fresh spinach and tomatoes available.",
      timestamp: "2024-01-15T09:00:00Z",
      isRead: true,
      messageType: "text",
    },
    {
      _id: "msg2",
      senderId: "currentUser",
      receiverId: "user456",
      message: "Hello Priya! Yes, I'm very interested. What's the price for spinach?",
      timestamp: "2024-01-15T09:05:00Z",
      isRead: true,
      messageType: "text",
    },
    {
      _id: "msg3",
      senderId: "user456",
      receiverId: "currentUser",
      message: "It's ₹40 per kg. Freshly harvested this morning! I can deliver within 2 hours.",
      timestamp: "2024-01-15T09:07:00Z",
      isRead: true,
      messageType: "text",
    },
    {
      _id: "msg4",
      senderId: "currentUser",
      receiverId: "user456",
      message: "That sounds perfect! Can I get 2kg of spinach and 3kg of tomatoes?",
      timestamp: "2024-01-15T09:10:00Z",
      isRead: true,
      messageType: "text",
    },
    {
      _id: "msg5",
      senderId: "user456",
      receiverId: "currentUser",
      message:
        "That would be ₹80 for spinach and ₹165 for tomatoes. Total ₹245. I'll prepare your order right away! 🌱",
      timestamp: "2024-01-15T09:12:00Z",
      isRead: false,
      messageType: "text",
    },
  ]

  useEffect(() => {
    const loadChatData = async () => {
      setIsLoading(true)
      try {
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setChatUser(mockChatUser)
        setMessages(mockMessages)
      } catch (error) {
        console.error("Error loading chat:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      loadChatData()
    }
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    const messageText = newMessage.trim()
    setNewMessage("")
    setIsSending(true)

    // Add message optimistically
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      senderId: "currentUser",
      receiverId: userId,
      message: messageText,
      timestamp: new Date().toISOString(),
      isRead: false,
      messageType: "text",
    }

    setMessages((prev) => [...prev, tempMessage])

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate typing indicator
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        // Simulate response (in real app, this would come from WebSocket)
        const responseMessage = {
          _id: `response_${Date.now()}`,
          senderId: userId,
          receiverId: "currentUser",
          message: "Thanks for your message! I'll get back to you soon. 😊",
          timestamp: new Date().toISOString(),
          isRead: false,
          messageType: "text",
        }
        setMessages((prev) => [...prev, responseMessage])
      }, 2000)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    }
  }

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
          <p className="mt-4 text-gray-600 font-medium">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/chat")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-xl">←</span>
              </button>

              <div className="relative">
                <img
                  src={chatUser?.profilePhoto || "/placeholder.svg?height=50&width=50"}
                  alt={chatUser?.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=50&width=50"
                  }}
                />
                {chatUser?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div>
                <h2 className="font-bold text-gray-900 text-lg">{chatUser?.fullName}</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span
                    className={`w-2 h-2 rounded-full ${chatUser?.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                  ></span>
                  <span className="text-gray-600">
                    {chatUser?.isOnline ? "Online" : `Last seen ${formatTime(chatUser?.lastSeen)}`}
                  </span>
                  <span className="text-green-600 font-medium capitalize">• {chatUser?.userType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/user/${userId}`)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
              >
                View Profile
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-xl">📞</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-xl">⋮</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.senderId === "currentUser"
            const showDate = index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp)

            return (
              <div key={message._id}>
                {/* Date separator */}
                {showDate && (
                  <div className="flex justify-center my-6">
                    <span className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm font-medium">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}

                {/* Message */}
                <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.message}</p>
                    </div>
                    <div
                      className={`flex items-center mt-1 space-x-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      {isCurrentUser && (
                        <span className="text-xs">
                          {message.isRead ? (
                            <span className="text-blue-500">✓✓</span>
                          ) : (
                            <span className="text-gray-400">✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${chatUser?.fullName?.split(" ")[0]}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                  <button type="button" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <span className="text-lg">📎</span>
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <span className="text-lg">😊</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className={`p-3 rounded-full transition-all duration-300 ${
                newMessage.trim() && !isSending
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-lg">➤</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
