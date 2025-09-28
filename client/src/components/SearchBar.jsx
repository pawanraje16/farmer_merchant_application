import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";

const SearchBar = ({ placeholder = "Search users..." }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const { posts } = usePost();
  const { user } = useAuth();

  // Extract unique users from posts data, excluding current logged-in user
  const users = posts.reduce((uniqueUsers, post) => {
    const author = post.author;
    if (author &&
        author.username !== user?.username &&
        !uniqueUsers.find(u => u.username === author.username)) {
      uniqueUsers.push({
        _id: author._id,
        username: author.username,
        fullName: author.fullName,
        avatar: author.avatar,
        userType: author.userType
      });
    }
    return uniqueUsers;
  }, []);

  // Filter users locally when search query changes
  const filteredUsers = users.filter(user =>
    searchQuery.trim().length >= 2 &&
    (user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show/hide suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length >= 2 && filteredUsers.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, filteredUsers]);


  const handleUserClick = (user) => {
    navigate(`/user/${user.username}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };


  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 pr-10 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            onFocus={() => {
              if (filteredUsers.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

      </div>

      {/* Search Results Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {filteredUsers.length > 0 ? (
            <div className="p-1">
              {filteredUsers.map((user, index) => (
                <button
                  key={user._id || index}
                  onClick={() => handleUserClick(user)}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg text-gray-500">👤</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {user.username}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user.fullName || user.username}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {user.userType}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.trim().length >= 2 ? (
            /* No Results Found */
            <div className="p-6 text-center">
              <div className="text-gray-400 text-3xl mb-2">🔍</div>
              <div className="text-sm font-medium text-gray-900 mb-1">No users found</div>
              <div className="text-xs text-gray-500">Try searching for a different name or username</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;