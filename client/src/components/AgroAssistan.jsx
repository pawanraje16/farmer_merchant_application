// src/components/AgroConnectAssistantChat.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext"; // We'll still need this for some context

const AgroConnectAssistantChat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  
  // This is a mock user object for the AI assistant
  const aiUser = {
    _id: "agro-assistant",
    username: "agro-assistant",
    fullName: "AgroConnect Assistant",
    avatar: "/placeholder.svg?height=50&width=50", 
    isOnline: true,
    userType: "AI",
  };

  useEffect(() => {
    // Set the initial welcome message from the AI
    setMessages([
      {
        _id: "ai-welcome-msg",
        senderId: aiUser._id,
        receiverId: user._id,
        message: "Hello! I'm your AgroConnect Assistant. How can I help you today?",
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      _id: Date.now().toString(),
      senderId: user._id,
      receiverId: aiUser._id,
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot/query-chatbot", {
        message: userMessage.message,
      });

      const aiMessage = {
        _id: Date.now().toString() + "-ai",
        senderId: aiUser._id,
        receiverId: user._id,
        message: response.data.text,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error with AI response:", error);
      const errorMessage = {
        _id: Date.now().toString() + "-error",
        senderId: aiUser._id,
        receiverId: user._id,
        message: "Sorry, I'm having trouble. Please try again later.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper functions for formatting time and date (copy from your original component)
  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Chat Header (re-used JSX) */}
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
                  src={aiUser.avatar}
                  alt={aiUser.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{aiUser.fullName}</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`w-2 h-2 rounded-full bg-green-500`}></span>
                  <span className="text-gray-600">Online</span>
                  <span className="text-green-600 font-medium capitalize">• {aiUser.userType}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
            const isCurrentUser = message.senderId === user._id;
            const showDate = index === 0 || formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);
            return (
              <div key={message._id}>
                {showDate && (
                  <div className="flex justify-center my-6">
                    <span className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm font-medium">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? "order-2" : "order-1"}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${isCurrentUser ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md" : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"}`}>
                      <p className="text-sm leading-relaxed">{message.message}</p>
                    </div>
                    <div className={`flex items-center mt-1 space-x-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                      {isCurrentUser && (
                        <span className="text-xs text-gray-400">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
                  placeholder={`Message ${aiUser.fullName.split(" ")[0]}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full transition-all duration-300 ${
                newMessage.trim()
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="text-lg">➤</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgroConnectAssistantChat;