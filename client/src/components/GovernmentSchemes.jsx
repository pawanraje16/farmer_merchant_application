"use client"

const GovernmentSchemes = () => {
  const schemes = [
    {
      id: 1,
      name: "PM-KISAN",
      description: "Direct income support to farmers",
      amount: "₹6,000/year",
      eligibility: "Small & marginal farmers",
      status: "Active",
      link: "#",
      icon: "💰",
    },
    {
      id: 2,
      name: "Crop Insurance",
      description: "Protection against crop loss",
      amount: "Up to ₹2 lakh",
      eligibility: "All farmers",
      status: "Open",
      link: "#",
      icon: "🛡️",
    },
    {
      id: 3,
      name: "Soil Health Card",
      description: "Free soil testing & recommendations",
      amount: "Free",
      eligibility: "All farmers",
      status: "Available",
      link: "#",
      icon: "🌱",
    },
    {
      id: 4,
      name: "KCC Loan",
      description: "Kisan Credit Card for farming needs",
      amount: "Up to ₹3 lakh",
      eligibility: "Farmers with land records",
      status: "Apply Now",
      link: "#",
      icon: "💳",
    },
  ]

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <span className="text-2xl">🏛️</span>
          <span>Government Schemes</span>
        </h3>

        <div className="space-y-4">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{scheme.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{scheme.name}</h4>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {scheme.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-green-600">{scheme.amount}</div>
                      <div className="text-xs text-gray-500">{scheme.eligibility}</div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Learn More →</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium">
            View All Schemes
          </button>
        </div>
      </div>
    </div>
  )
}

export default GovernmentSchemes
