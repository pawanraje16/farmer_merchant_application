const UserReviews = ({ userProfile, reviews = [] }) => {
  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">{userProfile?.socialStats?.rating}</div>
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-3xl ${i < Math.floor(userProfile?.socialStats?.rating) ? "text-yellow-500" : "text-gray-300"}`}
              >
                ⭐
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-lg">
            Based on <span className="font-semibold">{userProfile?.socialStats?.totalReviews}</span> reviews
          </p>
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start space-x-4">
                <img
                  src={review.reviewerPhoto || "/placeholder.svg?height=50&width=50"}
                  alt={review.reviewerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">⭐</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No reviews yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Reviews from customers will appear here to build trust and credibility
          </p>
        </div>
      )}
    </div>
  )
}

export default UserReviews
