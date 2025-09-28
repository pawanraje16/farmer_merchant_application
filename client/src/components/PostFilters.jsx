

import { useState } from "react"

const PostFilters = ({ filters, onFilterChange, showCropSpecificFilters = false }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    { value: "all", label: "All Categories", icon: "🌾" },
    { value: "Grains", label: "Grains", icon: "🌾" },
    { value: "Vegetables", label: "Vegetables", icon: "🥕" },
    { value: "Fruits", label: "Fruits", icon: "🍎" },
    { value: "Dairy", label: "Dairy", icon: "🥛" },
    { value: "Poultry", label: "Poultry", icon: "🐔" },
    { value: "Spices", label: "Spices", icon: "🌶️" },
  ]

  const states = [
    { value: "all", label: "All States" },
    { value: "Punjab", label: "Punjab" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Haryana", label: "Haryana" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Delhi", label: "Delhi" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Rajasthan", label: "Rajasthan" },
  ]

  const getDistrictsForState = (state) => {
    const districtMap = {
      Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
      Maharashtra: ["Pune", "Nashik", "Ratnagiri", "Chhatrapati Sambhajinagar"],
      Haryana: ["Karnal", "Sirsa", "Hisar", "Panipat"],
      Karnataka: ["Bangalore Rural", "Belgaum", "Mysore", "Hubli"],
      "Tamil Nadu": ["Coimbatore", "Salem", "Madurai", "Thanjavur"],
      Delhi: ["New Delhi", "North Delhi", "South Delhi", "East Delhi"],
      Gujarat: ["Ahmedabad", "Rajkot", "Junagadh", "Vadodara"],
      Rajasthan: ["Jaipur", "Jodhpur", "Kota", "Udaipur"],
    }
    return districtMap[state] || []
  }

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-50", label: "₹0 - ₹50" },
    { value: "50-100", label: "₹50 - ₹100" },
    { value: "100-200", label: "₹100 - ₹200" },
    { value: "200+", label: "₹200+" },
  ]

  const sortOptions = [
    { value: "latest", label: "Latest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ]

  const handleFilterChange = (key, value) => {
    if (showCropSpecificFilters) {
      // For Crops page with more detailed filters
      const newFilters = { ...filters }

      if (key === "location.state") {
        newFilters.location = { state: value, district: "all" }
      } else if (key === "location.district") {
        newFilters.location = { ...filters.location, district: value }
      } else {
        newFilters[key] = value
      }

      // Category validation - ensure category is never empty for crop-specific filters
      if (key === "cropType" && !value) {
        newFilters.cropType = "all"
      }

      onFilterChange(newFilters)
    } else {
      // For Home page with simpler filters
      const newFilters = { ...filters, [key]: value }

      // Category validation - ensure category is never empty
      if (key === "category" && !value) {
        newFilters.category = "all"
      }

      onFilterChange(newFilters)
    }
  }


  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <span className="text-xl">🔍</span>
            <span>{showCropSpecificFilters ? "Filter Crops" : "Filter & Sort"}</span>
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
          >
            {isExpanded ? "Hide Filters" : "Show Filters"}
          </button>
        </div>


        {/* Quick Category Filters - Always Visible */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.value}
              onClick={() => handleFilterChange(showCropSpecificFilters ? "cropType" : "category", category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (showCropSpecificFilters ? filters.cropType : filters.category) === category.value
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location Filter */}
            {showCropSpecificFilters ? (
              // Detailed location filter for Crops page
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={filters.location.state}
                    onChange={(e) => handleFilterChange("location.state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {states.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <select
                    value={filters.location.district}
                    onChange={(e) => handleFilterChange("location.district", e.target.value)}
                    disabled={filters.location.state === "all"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="all">All Districts</option>
                    {getDistrictsForState(filters.location.state).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              // Simple location filter for Home page
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By - Only for Home page */}
            {!showCropSpecificFilters && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Availability Filter - Only for Crops page */}
            {showCropSpecificFilters && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange("availability", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Items</option>
                  <option value="available">Available Only</option>
                  <option value="sold-out">Sold Out</option>
                </select>
              </div>
            )}

            {/* Organic Filter - Only for Crops page */}
            {showCropSpecificFilters && (
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.organic}
                    onChange={(e) => handleFilterChange("organic", e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">🌱 Organic products only</span>
                </label>
              </div>
            )}

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() =>
                  onFilterChange(
                    showCropSpecificFilters
                      ? {
                          cropType: "all",
                          location: { state: "all", district: "all" },
                          priceRange: "all",
                          availability: "all",
                          organic: false,
                        }
                      : {
                          category: "all",
                          location: "all",
                          priceRange: "all",
                          sortBy: "latest",
                        },
                  )
                }
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostFilters
