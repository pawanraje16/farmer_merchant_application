

import { useState } from "react"
import ChatButton from "./ChatButton"

const FloatingChatButton = ({ userId, userName, userPhoto, isOnline }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleStartChat = async (userId) => {
    // Navigate to chat
    window.location.href = `/chat/${userId}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-600 transition-colors z-10"
        >
          ✕
        </button>

        <ChatButton
          userId={userId}
          userName={userName}
          userPhoto={userPhoto}
          isOnline={isOnline}
          onStartChat={handleStartChat}
          variant="floating"
          className="animate-bounce-slow"
        />
      </div>
    </div>
  )
}

export default FloatingChatButton
