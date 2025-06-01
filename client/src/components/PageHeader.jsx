import React from "react"
import { Navigate } from "react-router-dom"

const PageHeader = ({ title, subtitle, icon, stats = [], actions = [] }) => {

  // const createPost=>()
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
      <div className="px-6 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
              <span className="text-4xl">{icon}</span>
              <span>{title}</span>
            </h1>
            <p className="text-gray-600 text-lg">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-green-100 px-4 py-2 rounded-full">
                <span className="text-green-800 font-semibold">{stat}</span>
              </div>
            ))}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
