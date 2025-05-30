"use client"

import { useState, useEffect } from "react"
import MarketRates from "../components/MarketRates"
import WeatherWidget from "../components/WeatherWidget"
import GovernmentSchemes from "../components/GovernmentSchemes"
import MarketNews from "../components/MarketNews"
import PriceAlerts from "../components/PriceAlerts"
import PageHeader from "../components/PageHeader"
import LoadingSpinner from "../components/LoadingSpinner"

const Market = () => {
  const [marketData, setMarketData] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState("Delhi")

  // Mock government API data for market rates
  const mockMarketRates = {
    lastUpdated: "2024-01-15T10:30:00Z",
    location: "Delhi",
    rates: [
      {
        commodity: "Wheat",
        variety: "HD-2967",
        unit: "Quintal",
        minPrice: 2250,
        maxPrice: 2350,
        modalPrice: 2300,
        trend: "up",
        change: 50,
        market: "Azadpur Mandi",
      },
      {
        commodity: "Rice",
        variety: "Basmati",
        unit: "Quintal",
        minPrice: 8500,
        maxPrice: 9200,
        modalPrice: 8850,
        trend: "stable",
        change: 0,
        market: "Azadpur Mandi",
      },
      {
        commodity: "Tomato",
        variety: "Local",
        unit: "Quintal",
        minPrice: 4500,
        maxPrice: 5500,
        modalPrice: 5000,
        trend: "down",
        change: -200,
        market: "Azadpur Mandi",
      },
      {
        commodity: "Onion",
        variety: "Nashik",
        unit: "Quintal",
        minPrice: 2800,
        maxPrice: 3200,
        modalPrice: 3000,
        trend: "up",
        change: 100,
        market: "Azadpur Mandi",
      },
      {
        commodity: "Potato",
        variety: "Jyoti",
        unit: "Quintal",
        minPrice: 1800,
        maxPrice: 2200,
        modalPrice: 2000,
        trend: "stable",
        change: 25,
        market: "Azadpur Mandi",
      },
      {
        commodity: "Sugarcane",
        variety: "Co-238",
        unit: "Quintal",
        minPrice: 350,
        maxPrice: 380,
        modalPrice: 365,
        trend: "up",
        change: 15,
        market: "Ghaziabad Mandi",
      },
    ],
  }

  // Mock weather data
  const mockWeatherData = {
    location: "Delhi",
    current: {
      temperature: 18,
      humidity: 65,
      windSpeed: 12,
      condition: "Partly Cloudy",
      icon: "⛅",
    },
    forecast: [
      { day: "Today", high: 22, low: 15, condition: "Partly Cloudy", icon: "⛅", rain: 10 },
      { day: "Tomorrow", high: 24, low: 16, condition: "Sunny", icon: "☀️", rain: 0 },
      { day: "Wed", high: 20, low: 14, condition: "Rainy", icon: "🌧️", rain: 80 },
      { day: "Thu", high: 19, low: 13, condition: "Cloudy", icon: "☁️", rain: 30 },
      { day: "Fri", high: 23, low: 17, condition: "Sunny", icon: "☀️", rain: 5 },
    ],
    alerts: [
      {
        type: "warning",
        message: "Light rain expected in next 2 days. Good for winter crops.",
        icon: "🌧️",
      },
    ],
  }

  useEffect(() => {
    const loadMarketData = async () => {
      setIsLoading(true)
      try {
        // Simulate government API calls
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // In real implementation, these would be actual API calls:
        // const marketResponse = await fetch(`/api/government/market-rates?location=${selectedLocation}`)
        // const weatherResponse = await fetch(`/api/weather?location=${selectedLocation}`)

        setMarketData(mockMarketRates)
        setWeatherData(mockWeatherData)
      } catch (error) {
        console.error("Error loading market data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMarketData()
  }, [selectedLocation])

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading market data..." icon="📊" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <PageHeader
          title="Market Intelligence"
          subtitle="Live market rates, weather updates, and government schemes"
          icon="📊"
          stats={["Live Data"]}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Market Rates */}
          <div className="lg:col-span-2 space-y-8">
            <MarketRates data={marketData} />
            <MarketNews />
          </div>

          {/* Right Column - Weather & Schemes */}
          <div className="space-y-8">
            <WeatherWidget data={weatherData} />
            <PriceAlerts />
            <GovernmentSchemes />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Market
