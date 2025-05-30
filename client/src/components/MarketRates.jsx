"use client"

import { useState } from "react"

const MarketRates = ({ data }) => {
  const [sortBy, setSortBy] = useState("commodity")
  const [filterBy, setFilterBy] = useState("all")

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return "📈"
      case "down":
        return "📉"
      default:
        return "➡️"
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatLastUpdated = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const sortedRates = [...(data?.rates || [])].sort((a, b) => {
    switch (sortBy) {
      case "commodity":
        return a.commodity.localeCompare(b.commodity)
      case "price":
        return b.modalPrice - a.modalPrice
      case "change":
        return Math.abs(b.change) - Math.abs(a.change)
      default:
        return 0
    }
  })

  const filteredRates = sortedRates.filter((rate) => {
    if (filterBy === "all") return true
    return rate.trend === filterBy
  })

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <span>Live Market Rates</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Last updated: {formatLastUpdated(data?.lastUpdated)} • {data?.location}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Trends</option>
              <option value="up">Rising 📈</option>
              <option value="down">Falling 📉</option>
              <option value="stable">Stable ➡️</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="commodity">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="change">Sort by Change</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commodity
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variety
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modal Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRates.map((rate, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{rate.commodity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{rate.variety}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-lg font-bold text-gray-900">₹{rate.modalPrice.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">per {rate.unit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-600">
                    ₹{rate.minPrice.toLocaleString()} - ₹{rate.maxPrice.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`flex items-center justify-end space-x-1 ${getTrendColor(rate.trend)}`}>
                    <span>{getTrendIcon(rate.trend)}</span>
                    <span className="font-medium">
                      {rate.change > 0 ? "+" : ""}₹{rate.change}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{rate.market}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No rates found for the selected filter</p>
        </div>
      )}

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          * Data sourced from Government of India's Agricultural Marketing Division
        </p>
      </div>
    </div>
  )
}

export default MarketRates
