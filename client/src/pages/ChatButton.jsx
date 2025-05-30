"use client"

import { useState } from "react"

const ChatButton = ({ userId, userName, onStartChat, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 ${className}`}
    >
      <span className="text-lg">💬</span>
      <span>{isLoading ? "Starting..." : `Chat with ${userName}`}</span>
    </button>
  )
}

export default ChatButton
