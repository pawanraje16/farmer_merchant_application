// "use client"

const CropMap = ({ crops, onCropClick }) => {
  // This is a placeholder for map implementation
  // In a real app, you'd use Google Maps, Mapbox, or similar

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl">🗺️</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Map View</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Map integration with Google Maps or Mapbox will be implemented here to show crop locations visually
        </p>

        {/* Placeholder map content */}
        <div className="bg-gray-100 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {crops.slice(0, 6).map((crop) => (
              <div
                key={crop._id}
                onClick={() => onCropClick(crop)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-2xl mb-2">📍</div>
                <div className="font-semibold text-sm">{crop.name}</div>
                <div className="text-xs text-gray-600">{crop.locations[0].state}</div>
                <div className="text-xs text-green-600 font-medium">₹{crop.averagePrice}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          * This will show interactive pins for each crop location with detailed information
        </p>
      </div>
    </div>
  )
}

export default CropMap
