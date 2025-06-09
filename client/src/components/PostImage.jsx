"use client"
import { useState } from "react"

const PostImage = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Function to handle image path/URL
  const getImageSrc = (src) => {
    // If it's already a full URL (Cloudinary)
    if (src?.startsWith("http")) {
      return src
    }

    // If it's a local path
    if (src?.startsWith("/")) {
      // For development with local images
      return src
    }

    // Fallback to placeholder
    return "/placeholder.svg?height=300&width=400"
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-gray-400">🌾</span>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">❌</span>
        </div>
      )}

      <img
        src={getImageSrc(src) || "/placeholder.svg"}
        alt={alt || "Product image"}
        className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
      
    </div>
  )
}

export default PostImage
