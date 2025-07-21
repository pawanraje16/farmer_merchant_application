// "use client"

import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();
  const {logout} = useAuth()
  const {totalUnreadCount} = useChat();

  const handleProfile = () => {
    navigate("/Profile")
  }

  const handleChat = () => {
    navigate("/Chat")
  }

  const handleLogout = () => {
    logout()
    navigate("/Login")
  }

  return (
    <nav className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg border border-green-200 px-4 py-3 rounded-2xl m-2 md:m-4 backdrop-blur-sm">
      {/* Main container */}
      <div className="max-w-7xl mx-auto">
        {/* Top row: Logo + Desktop Nav + Search + Icons */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 text-green-800 font-bold text-xl">
            <div className="bg-green-200 p-2 rounded-full">
              <span className="text-2xl">🌿</span>
            </div>
            <span className="hidden sm:block">AgroConnect</span>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink
              to=""
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-green-700 hover:bg-green-200 hover:text-green-800"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/Crops"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-green-700 hover:bg-green-200 hover:text-green-800"
                }`
              }
            >
              Crops
            </NavLink>
            <NavLink
              to="/Market"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-green-700 hover:bg-green-200 hover:text-green-800"
                }`
              }
            >
              Market
            </NavLink>
          </div>

          {/* Right side: Search + Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Responsive width */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-32 sm:w-48 md:w-56 lg:w-64 pl-10 pr-4 py-2 bg-white border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 shadow-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">🔍</div>
            </div>

            {/* Action Icons - Hidden on small screens */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={handleProfile}
                title="Profile"
                className="p-2 text-green-700 hover:bg-green-200 rounded-full transition-all duration-300 hover:scale-110"
              >
                <span className="text-xl">👤</span>
              </button>
              <button
                onClick={handleChat}
                title="Chat"
                className="relative p-2 text-green-700 hover:bg-green-200 rounded-full transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <span className="text-xl">💬</span>
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalUnreadCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="px-3 py-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-300 font-medium text-sm"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-green-700 hover:bg-green-200 rounded-full transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-green-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1" : ""}`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-green-700 transition-all duration-300 mt-1 ${menuOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-green-700 transition-all duration-300 mt-1 ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-2 py-4 border-t border-green-200">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive ? "bg-green-600 text-white shadow-md" : "text-green-700 hover:bg-green-200"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              🏠 Home
            </NavLink>
            <NavLink
              to="/Crops"
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive ? "bg-green-600 text-white shadow-md" : "text-green-700 hover:bg-green-200"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              🌾 Crops
            </NavLink>
            <NavLink
              to="/Market"
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive ? "bg-green-600 text-white shadow-md" : "text-green-700 hover:bg-green-200"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              🏪 Market
            </NavLink>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col space-y-2 py-4 border-t border-green-200">
            <button
              onClick={() => {
                handleProfile()
                setMenuOpen(false)
              }}
              className="flex items-center space-x-3 px-4 py-3 text-green-700 hover:bg-green-200 rounded-xl transition-all duration-300"
            >
              <span className="text-xl">👤</span>
              <span className="font-medium">Profile</span>
            </button>
            <button
              onClick={() => {
                handleChat()
                setMenuOpen(false)
              }}
              className="flex items-center space-x-3 px-4 py-3 text-green-700 hover:bg-green-200 rounded-xl transition-all duration-300"
            >
              <span className="text-xl">💬</span>
              <span className="font-medium">Chat</span>
            </button>
            <button
              onClick={() => {
                handleLogout()
                setMenuOpen(false)
              }}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
