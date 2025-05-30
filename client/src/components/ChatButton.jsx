"use client"

import { useState } from "react"

const ChatButton = ({
  userId,
  userName,
  userPhoto,
  isOnline = false,
  onStartChat,
  className = "",
  variant = "primary", // primary, secondary, floating
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onStartChat(userId)
    } catch (error) {
      console.error("Error starting chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Different button variants
  const getButtonStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
      case "floating":
        return "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-110"
      default:
        return "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
    }
  }

  const getIconAnimation = () => {
    if (isLoading) return "animate-bounce"
    if (isHovered) return "animate-pulse"
    return ""
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative flex items-center space-x-3 px-6 py-3 rounded-2xl 
        transition-all duration-300 font-medium shadow-lg hover:shadow-xl 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getButtonStyles()}
        ${className}
      `}
    >
      {/* Online indicator for floating variant */}
      {variant === "floating" && isOnline && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      )}

      {/* User photo for secondary variant */}
      {variant === "secondary" && userPhoto && (
        <div className="relative">
          <img
            src={userPhoto || "/placeholder.svg?height=32&width=32"}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
          />
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      )}

      {/* Chat icon */}
      <div className={`text-xl ${getIconAnimation()}`}>
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "💬"
        )}
      </div>

      {/* Button text */}
      <span className="font-semibold">
        {isLoading
          ? "Connecting..."
          : variant === "floating"
            ? "Chat"
            : `Chat with ${userName?.split(" ")[0] || "User"}`}
      </span>

      {/* Hover effect indicator */}
      <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

      {/* Ripple effect on click */}
      {isHovered && <div className="absolute inset-0 rounded-2xl bg-white opacity-20 animate-ping"></div>}
    </button>
  )
}

export default ChatButton
