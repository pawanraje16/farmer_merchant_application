"use client"

const WeatherWidget = ({ data }) => {
  if (!data) return null

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <span className="text-2xl">🌤️</span>
          <span>Weather Conditions</span>
        </h3>

        {/* Current Weather */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{data.current.temperature}°C</div>
              <div className="text-gray-600">{data.current.condition}</div>
              <div className="text-sm text-gray-500 mt-2">📍 {data.location}</div>
            </div>
            <div className="text-6xl">{data.current.icon}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
            <div className="text-center">
              <div className="text-sm text-gray-600">Humidity</div>
              <div className="font-semibold">{data.current.humidity}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Wind</div>
              <div className="font-semibold">{data.current.windSpeed} km/h</div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">5-Day Forecast</h4>
          {data.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{day.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{day.day}</div>
                  <div className="text-sm text-gray-600">{day.condition}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {day.high}°/{day.low}°
                </div>
                <div className="text-sm text-blue-600">{day.rain}% rain</div>
              </div>
            </div>
          ))}
        </div>

        {/* Weather Alerts */}
        {data.alerts && data.alerts.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Weather Alerts</h4>
            {data.alerts.map((alert, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{alert.icon}</span>
                  <div>
                    <div className="font-medium text-yellow-800">Agricultural Advisory</div>
                    <div className="text-sm text-yellow-700 mt-1">{alert.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherWidget
