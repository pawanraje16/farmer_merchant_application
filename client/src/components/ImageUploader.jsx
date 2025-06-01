"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

const ImageUploader = ({ onImagesChange }) => {
  const fileInputRef = useRef(null)
  const [previewImages, setPreviewImages] = useState([])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    // Create preview URLs for the images
    const newPreviewImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }))

    const updatedPreviews = [...previewImages, ...newPreviewImages]
    setPreviewImages(updatedPreviews)

    // Pass the actual files to the parent component
    onImagesChange(updatedPreviews.map((preview) => preview.file))
  }

  const removeImage = (index) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index].url)

    // Remove the image from the array
    const newPreviewImages = [...previewImages]
    newPreviewImages.splice(index, 1)
    setPreviewImages(newPreviewImages)

    // Pass the updated files to the parent component
    onImagesChange(newPreviewImages.map((preview) => preview.file))
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Click to upload product images</p>
        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>

      {previewImages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image Previews</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.url || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
