import React from "react"

const CreatePostPrompt = ({ onCreatePost }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex items-center space-x-4">
        <img
          src="/placeholder.svg?height=50&width=50"
          alt="Your profile"
          className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
        />
        <button
          onClick={onCreatePost}
          className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-gray-500"
        >
          What's growing on your farm today? Share with the community...
        </button>
        <button
          onClick={onCreatePost}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
        >
          📝 Post
        </button>
      </div>
    </div>
  )
}

export default CreatePostPrompt
