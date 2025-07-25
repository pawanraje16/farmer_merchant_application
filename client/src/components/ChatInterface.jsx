

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useChat } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"

const ChatInterface = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  // const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  // const [selectedUser, setSelectedUser] = useState({})
  const [isTyping, setIsTyping] = useState(false)

   const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, users, getUsers } = useChat();
   const {user} = useAuth()
   
  // Mock chat user data
  const mockChatUser = {
    _id: "user456",
    username: "organic_farmer_priya",
    fullName: "Priya Sharma",
    avatar: "/placeholder.svg?height=50&width=50",
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
    // Ensure we have the user list
    if (!users || users.length === 0) {
      await getUsers(); // This will update `users`
    }

    if (userId && users.length > 0) {
      const targetUser = users.find(u => u.username === userId);
      if (targetUser) {
        setSelectedUser(targetUser);
        setIsLoading(true);
        try {
          await getMessages(targetUser._id);
        } catch (err) {
          console.error("Error fetching messages:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  loadChatData();
}, [userId, users]);

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if(messagesEndRef.current && messages){messagesEndRef.current.scrollIntoView({ behavior: "smooth" })}
  }


  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return null
    
    setIsSending(true)
    await sendMessage({text: newMessage.trim()});
    setIsSending(false);  
    setNewMessage("")
  
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
                  src={selectedUser?.avatar || "/placeholder.svg?height=50&width=50"}
                  alt={selectedUser?.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=50&width=50"
                  }}
                />
                {selectedUser?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div>
                <h2 className="font-bold text-gray-900 text-lg">{selectedUser?.fullName}</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span
                    className={`w-2 h-2 rounded-full ${selectedUser?.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                  ></span>
                  <span className="text-gray-600">
                    {selectedUser?.isOnline ? "Online" : `Last seen ${formatTime(selectedUser?.lastSeen)}`}
                  </span>
                  <span className="text-green-600 font-medium capitalize">• {selectedUser?.userType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/user/${selectedUser?.username}`)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
              >
               {selectedUser?.fullName}
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
            const isCurrentUser = message.senderId === user._id
            const showDate = index === 0 || formatDate(messages[index - 1].
          createdAt) !== formatDate(message.
          createdAt)

            return (
              <div key={message._id}>
                {/* Date separator */}
                {showDate && (
                  <div className="flex justify-center my-6">
                    <span className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm font-medium">
                      {formatDate(message.createdAt)}
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
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div
                      className={`flex items-center mt-1 space-x-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
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
                  placeholder={`Message ${selectedUser?.fullName?.split(" ")[0]}...`}
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
