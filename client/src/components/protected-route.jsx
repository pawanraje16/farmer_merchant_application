"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useFeed } from "../context/FeedContext"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useFeed()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}

export default ProtectedRoute
