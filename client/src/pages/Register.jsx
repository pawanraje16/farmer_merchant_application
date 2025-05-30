"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadhaarNumber: "",
    userType: "", // farmer or merchant
    majorProduct: "", // flexible field for main product/crop interest
    profilePhoto: null,
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        profilePhoto: file,
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.aadhaarNumber) {
      newErrors.aadhaarNumber = "Aadhaar number is required"
    } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = "Aadhaar number must be 12 digits"
    }

    if (!formData.userType) {
      newErrors.userType = "Please select your role"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful registration
      localStorage.setItem("authToken", "example-token-12345")
      localStorage.setItem("userType", formData.userType)
      localStorage.setItem("username", formData.username)

      // Redirect to home page
      navigate("/")
    } catch (error) {
      setErrors({
        form: "Registration failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-green-200 p-3 rounded-full">
            <span className="text-4xl">🌿</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-green-800">Join AgroConnect</h2>
        <p className="mt-2 text-center text-sm text-green-600">Connect with farmers and merchants across India</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10 border border-green-200">
          {errors.form && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700">{errors.form}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-green-200">
                  {photoPreview ? (
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-gray-400">📷</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full cursor-pointer hover:bg-green-700">
                  <span className="text-sm">✏️</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">Upload profile photo (optional)</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-500">@</span>
                </div>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 block w-full py-3 border ${
                    errors.username ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Choose a unique username"
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-500">✉️</span>
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 block w-full py-3 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-500">🆔</span>
                </div>
                <input
                  name="aadhaarNumber"
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  className={`pl-10 block w-full py-3 border ${
                    errors.aadhaarNumber ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="12-digit Aadhaar number"
                  maxLength="12"
                />
              </div>
              {errors.aadhaarNumber && <p className="mt-1 text-sm text-red-600">{errors.aadhaarNumber}</p>}
            </div>

            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() => setFormData({ ...formData, userType: "farmer" })}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userType === "farmer"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🚜</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Farmer</h4>
                      <p className="text-sm text-gray-600">I grow and sell agricultural products</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, userType: "merchant" })}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userType === "merchant"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🏪</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Merchant/Buyer</h4>
                      <p className="text-sm text-gray-600">I buy agricultural products for business</p>
                    </div>
                  </div>
                </div>
              </div>
              {errors.userType && <p className="mt-2 text-sm text-red-600">{errors.userType}</p>}
            </div>

            {/* Major Product - Conditional Field */}
            {formData.userType && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {formData.userType === "farmer"
                    ? "What do you mainly grow? (Optional)"
                    : "What products do you mainly buy? (Optional)"}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-green-500">{formData.userType === "farmer" ? "🌾" : "🛒"}</span>
                  </div>
                  <input
                    name="majorProduct"
                    type="text"
                    value={formData.majorProduct}
                    onChange={handleChange}
                    className="pl-10 block w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={
                      formData.userType === "farmer"
                        ? "e.g., Rice, Wheat, Vegetables..."
                        : "e.g., Grains, Fruits, Vegetables..."
                    }
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.userType === "farmer" ? "Help buyers find you easily" : "Help farmers connect with you"}
                </p>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-500">🔒</span>
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 block w-full py-3 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-500">🔒</span>
                </div>
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 block w-full py-3 border ${
                    errors.confirmPassword ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-medium text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Privacy Policy
                  </a>
                </label>
                {errors.agreeToTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="hidden sm:block absolute top-10 left-10 opacity-20">
        <span className="text-6xl">🌾</span>
      </div>
      <div className="hidden sm:block absolute bottom-10 right-10 opacity-20">
        <span className="text-6xl">🚜</span>
      </div>
    </div>
  )
}

export default Register
