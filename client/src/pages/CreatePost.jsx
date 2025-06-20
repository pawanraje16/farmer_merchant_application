
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, MapPin, Package, Tag } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { useFeed } from "../context/FeedContext"

const CreatePost = () => {
  const {axios} = useFeed()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    priceUnit: "per kg",
    originalPrice: "",
    category: "",
    cropType: "",
    quantity: "",
    location: {
      state: "",
      district: "",
      city: "",
      village: "",
      pincode: "",
    },
    isOrganic: false,
    isFeatured: false,
    tags: [],
    specifications: {
      variety: "",
      harvestDate: "",
      shelLife: "", // Keep this as shelLife to match backend
      minorderQunatity: "", // Keep this spelling to match backend
      packaging: "",
    },
  })
  const [previewImages, setPreviewImages] = useState([])
  const [currentTag, setCurrentTag] = useState("")

  const categories = [
    "Grains",
    "Vegetables",
    "Fruits",
    "Dairy",
    "Spices",
    "Pulses",
    "Organic",
    "Seeds",
    "Fertilizers",
    "Equipment",
  ]

  const priceUnits = ["per kg", "per quintal", "per piece", "per box", "per bag", "per liter"]

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])

    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      const newPreviewImages = validFiles.map((file) => URL.createObjectURL(file))
      setPreviewImages([...previewImages, ...newPreviewImages])
      setImages([...images, ...validFiles])
      toast.success(`${validFiles.length} image(s) added successfully`)
    }
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(previewImages[index])
    const newPreviewImages = [...previewImages]
    newPreviewImages.splice(index, 1)
    setPreviewImages(newPreviewImages)

    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    toast.success("Image removed")
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()],
      }))
      setCurrentTag("")
      toast.success("Tag added")
    } else if (formData.tags.includes(currentTag.trim().toLowerCase())) {
      toast.error("Tag already exists")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
    toast.success("Tag removed")
  }

  const validateForm = () => {
    const requiredFields = [
      { field: formData.title, name: "Title" },
      { field: formData.description, name: "Description" },
      { field: formData.price, name: "Price" },
      { field: formData.category, name: "Category" },
      { field: formData.cropType, name: "Crop Type" },
      { field: formData.quantity, name: "Quantity" },
      { field: formData.location.state, name: "State" },
      { field: formData.location.district, name: "District" },
      { field: formData.location.city, name: "City" },
      { field: formData.location.village, name: "Village" },
      { field: formData.location.pincode, name: "Pincode" },
      { field: formData.specifications.shelLife, name: "Shelf Life" },
    ]

    for (const { field, name } of requiredFields) {
      if (!field || !field.toString().trim()) {
        toast.error(`${name} is required`)
        return false
      }
    }

    if (images.length === 0) {
      toast.error("At least one product image is required")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("Form data before validation:", formData) // Debug log

    if (!validateForm()) {
      return
    }

    setLoading(true)
    const loadingToast = toast.loading("Creating your post...")

    try {
      // Create FormData for multipart/form-data
      const postFormData = new FormData()

      // Append all form fields exactly as expected by backend
      postFormData.append("title", formData.title)
      postFormData.append("description", formData.description)
      postFormData.append("price", formData.price)
      postFormData.append("priceUnit", formData.priceUnit)
      postFormData.append("category", formData.category)
      postFormData.append("cropType", formData.cropType)
      postFormData.append("quantity", formData.quantity)

      // Location fields (flattened as individual fields)
      postFormData.append("state", formData.location.state)
      postFormData.append("district", formData.location.district)
      postFormData.append("city", formData.location.city)
      postFormData.append("village", formData.location.village)
      postFormData.append("pincode", formData.location.pincode)

      // Specifications fields (flattened as individual fields)
      postFormData.append("variety", formData.specifications.variety)
      postFormData.append("shelLife", formData.specifications.shelLife)
      postFormData.append("packaging", formData.specifications.packaging)
      postFormData.append("minorderQunatity", formData.specifications.minorderQunatity)

      // Tags as comma-separated string (as expected by backend)
      postFormData.append("tags", formData.tags.join(","))

      // Append images
      images.forEach((image) => {
        postFormData.append("images", image)
      })

      // Debug: Log what we're sending
      console.log("Sending to backend:")
      for (const [key, value] of postFormData.entries()) {
        console.log(key, value)
      }

      // Make API call
      const response = await axios.post("/api/v1/post/create-post", postFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds
      })

      toast.dismiss(loadingToast)
      toast.success("Post created successfully! 🎉")

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        priceUnit: "per kg",
        originalPrice: "",
        category: "",
        cropType: "",
        quantity: "",
        location: {
          state: "",
          district: "",
          city: "",
          village: "",
          pincode: "",
        },
        isOrganic: false,
        isFeatured: false,
        tags: [],
        specifications: {
          variety: "",
          harvestDate: "",
          shelLife: "",
          minorderQunatity: "",
          packaging: "",
        },
      })
      setImages([])
      setPreviewImages([])

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (error) {
      toast.dismiss(loadingToast)

      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Failed to create post"
        toast.error(errorMessage)
        console.error("Server error:", error.response.data)
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error. Please check your connection.")
        console.error("Network error:", error.request)
      } else {
        // Something else happened
        toast.error("An unexpected error occurred")
        console.error("Error:", error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      /> */}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Package className="mr-3 h-8 w-8 text-green-600" />
          Create New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Organic Carrots - Freshly Harvested"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe your product in detail (quality, features, benefits, etc.)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Type *
                  </label>
                  <input
                    type="text"
                    id="cropType"
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Carrot, Wheat, Rice"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Quantity */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Quantity</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="35"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="priceUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Unit *
                </label>
                <select
                  id="priceUnit"
                  name="priceUnit"
                  value={formData.priceUnit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {priceUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="40"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Available Quantity *
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 100 kg available"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location.state" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="location.district" className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  id="location.district"
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Shimla"
                />
              </div>
              <div>
                <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Shimla"
                />
              </div>
              <div>
                <label htmlFor="location.pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  id="location.pincode"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 171001"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="location.village" className="block text-sm font-medium text-gray-700 mb-1">
                Village *
              </label>
              <input
                type="text"
                id="location.village"
                name="location.village"
                value={formData.location.village}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Narkanda"
              />
            </div>
          </div>

          {/* Product Specifications */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Specifications</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="specifications.variety" className="block text-sm font-medium text-gray-700 mb-1">
                  Variety
                </label>
                <input
                  type="text"
                  id="specifications.variety"
                  name="specifications.variety"
                  value={formData.specifications.variety}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Pusa Rudhira"
                />
              </div>
              <div>
                <label htmlFor="specifications.harvestDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Harvest Date
                </label>
                <input
                  type="text"
                  id="specifications.harvestDate"
                  name="specifications.harvestDate"
                  value={formData.specifications.harvestDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., April 2024"
                />
              </div>
              <div>
                <label htmlFor="specifications.shelLife" className="block text-sm font-medium text-gray-700 mb-1">
                  Shelf Life *
                </label>
                <input
                  type="text"
                  id="specifications.shelLife"
                  name="specifications.shelLife"
                  value={formData.specifications.shelLife}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 1 month"
                />
              </div>
              <div>
                <label
                  htmlFor="specifications.minorderQunatity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Minimum Order Quantity
                </label>
                <input
                  type="text"
                  id="specifications.minorderQunatity"
                  name="specifications.minorderQunatity"
                  value={formData.specifications.minorderQunatity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 10 kg"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="specifications.packaging" className="block text-sm font-medium text-gray-700 mb-1">
                Packaging Options
              </label>
              <input
                type="text"
                id="specifications.packaging"
                name="specifications.packaging"
                value={formData.specifications.packaging}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Loose or 10kg bag"
              />
            </div>
          </div>

          {/* Tags and Options */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Tags & Options
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Organic Product</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Featured Product</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Press Enter to add)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Add tags (e.g., organic, fresh, local)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Images *</h2>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
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
              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
            </div>

            {previewImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Image Previews ({previewImages.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium transition-colors"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Post...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
