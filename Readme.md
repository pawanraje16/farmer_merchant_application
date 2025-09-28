# 🌾 AgroConnect - Bridging the Gap Between Farmers and Merchants

## Overview

AgroConnect is a comprehensive web platform designed to bridge the gap between farmers and merchants, creating a seamless ecosystem for agricultural commerce and community building. Our platform connects agricultural producers directly with buyers while fostering knowledge sharing and community growth within the farming sector.

## 🎯 Mission

We are bridging the gap between merchants and farmers by:
- **Connecting Communities**: Farmers can connect with each other to share knowledge and build strong agricultural communities
- **Direct Market Access**: Merchants can easily find and source crops directly from farmers
- **Location-Based Discovery**: Advanced search capabilities allow merchants to find crops by location and business products
- **Knowledge Sharing**: Platform for farmers to exchange farming techniques, best practices, and agricultural insights

## ✨ Key Features

### For Farmers 🚜
- **Community Building**: Connect with fellow farmers to share knowledge and experiences
- **Direct Sales**: List and sell crops directly to merchants without intermediaries
- **Knowledge Exchange**: Share farming techniques, crop management tips, and agricultural insights
- **Profile Management**: Showcase farming expertise, location, and available crops
- **Real-time Chat**: Communicate directly with merchants and other farmers

### For Merchants 🏪
- **Smart Search**: Find crops by location, category, and specific agricultural products
- **Location-Based Filtering**: Search for farmers and crops in specific states and districts
- **Direct Communication**: Connect directly with farmers through integrated chat system
- **Market Discovery**: Explore available crops and agricultural products across different regions
- **Price Comparison**: Compare prices and quality across different farmers

### Platform Features 🌐
- **Instagram-like Search**: Smart user search functionality in the navbar
- **Advanced Filtering**: Filter posts by category, location, price range, and availability
- **Real-time Messaging**: Built-in chat system for seamless communication
- **User Profiles**: Comprehensive profiles showing user type, location, and agricultural focus
- **Post Management**: Create, view, and manage agricultural product listings
- **Mobile Responsive**: Fully responsive design for mobile and desktop access

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing for single page application
- **Context API** - State management for user authentication, posts, and chat
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework for Node.js
- **MongoDB** - NoSQL database for storing user and product data
- **Mongoose** - MongoDB object modeling for Node.js
- **Socket.io** - Real-time bidirectional event-based communication
- **JWT** - JSON Web Tokens for secure authentication
- **Cloudinary** - Cloud-based image and video management

## 📁 Project Structure

```
farmer_merchant_application/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx         # Navigation with search functionality
│   │   │   ├── SearchBar.jsx      # Smart user search component
│   │   │   ├── PostFilters.jsx    # Advanced filtering component
│   │   │   ├── FeedPost.jsx       # Individual post display
│   │   │   └── ChatList.jsx       # Chat interface component
│   │   ├── context/               # React Context for state management
│   │   │   ├── AuthContext.jsx    # User authentication state
│   │   │   ├── PostContext.jsx    # Posts and feed management
│   │   │   ├── ChatContext.jsx    # Real-time messaging state
│   │   │   └── FilterContext.jsx  # Search and filter state
│   │   ├── pages/                 # Main application pages
│   │   │   ├── Home.jsx          # Main feed with posts and filters
│   │   │   ├── Profile.jsx       # User profile management
│   │   │   ├── Chat.jsx          # Messaging interface
│   │   │   └── Market.jsx        # Marketplace discovery
│   │   └── utils/                # Utility functions and API calls
└── server/                        # Node.js backend
    ├── src/
    │   ├── controllers/           # Request handlers
    │   │   ├── user.controller.js # User management
    │   │   ├── post.controller.js # Post management
    │   │   ├── search.controller.js # Search functionality
    │   │   └── message.controller.js # Chat system
    │   ├── models/               # Database schemas
    │   │   ├── user.model.js     # User data model
    │   │   ├── post.model.js     # Post data model
    │   │   └── message.model.js  # Message data model
    │   ├── routes/               # API route definitions
    │   ├── middleware/           # Authentication and validation
    │   └── utils/               # Helper functions and utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pawanraje16/farmer_merchant_application.git
   cd farmer_merchant_application
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the server directory:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   Create `.env` file in the client directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:4000`

## 📱 Key Functionalities

### User Authentication
- Secure registration and login system
- JWT-based authentication
- Role-based access (Farmer/Merchant)
- Profile management with avatar upload

### Search and Discovery
- **Navbar Search**: Instagram-like user search functionality using existing post data
- **Advanced Filters**: Filter by category, location, price range, and availability
- **Location-Based Search**: Find users and products by state and district
- **Real-time Filtering**: Instant results as users type

### Communication System
- Real-time chat between farmers and merchants
- Chat history and message management
- Online status indicators
- Unread message notifications

### Content Management
- Create and manage agricultural product posts
- Image upload with Cloudinary integration
- Post categorization and tagging
- Like and engagement system

## 🌍 Impact

AgroConnect is making a real difference by:
- **Eliminating Middlemen**: Direct connection between farmers and merchants
- **Increasing Farmer Income**: Better prices through direct sales
- **Knowledge Sharing**: Community-driven agricultural education
- **Market Transparency**: Clear pricing and product availability
- **Rural Development**: Connecting rural farmers with urban markets

## 🤝 Contributing

We welcome contributions to AgroConnect! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

AgroConnect is developed by a passionate team dedicated to revolutionizing agricultural commerce and empowering farming communities.

## Author
- [pawanraje16](https://github.com/pawanraje16)

---

**Together, we're building a stronger agricultural future! 🌾**
