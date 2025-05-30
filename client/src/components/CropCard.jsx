"use client"

const EmptyState = ({ title, message, icon, actionLabel, onAction, showAction = true }) => {
  return (
    <div className="text-center py-16">
      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
        <span className="text-6xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">{message}</p>
      {showAction && actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
