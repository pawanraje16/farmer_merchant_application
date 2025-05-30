"use client"

const MarketNews = () => {
  const news = [
    {
      id: 1,
      title: "Wheat Prices Rise Due to Export Demand",
      summary: "International demand pushes wheat prices up by 5% this week",
      time: "2 hours ago",
      category: "Market Update",
      impact: "positive",
    },
    {
      id: 2,
      title: "New Organic Certification Guidelines Released",
      summary: "Government announces simplified process for organic certification",
      time: "5 hours ago",
      category: "Policy",
      impact: "neutral",
    },
    {
      id: 3,
      title: "Monsoon Forecast: Normal Rainfall Expected",
      summary: "IMD predicts normal monsoon, positive for Kharif crops",
      time: "1 day ago",
      category: "Weather",
      impact: "positive",
    },
  ]

  const getImpactColor = (impact) => {
    switch (impact) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <span className="text-2xl">📰</span>
          <span>Market News</span>
        </h3>

        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.summary}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-green-600 hover:text-green-700 font-medium">
            View All News →
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarketNews
