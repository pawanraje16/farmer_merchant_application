# Farmer Merchant Application

A full-stack web application connecting farmers and merchants for crop trading, market news, government schemes, and more.

## Features
- User authentication (register, login, profile)
- Crop posts and trading
- Chat between users
- Market rates and news
- Government schemes info
- Price alerts
- Image uploads
- Weather widget

## Tech Stack
- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/pawanraje16/farmer_merchant_application.git
   cd farmer_merchant_application
   ```

2. **Install dependencies:**
   - For client:
     ```powershell
     cd client
     npm install
     ```
     
  **Main client dependencies:**
  - react
  - react-dom
  - react-router-dom
  - axios
  - tailwindcss
  - socket.io-client
   - For server:
     ```powershell
     cd ../server
     npm install
     ```
     
  **Main server dependencies:**
  - express
  - mongoose
  - dotenv
  - cors
  - jsonwebtoken
  - multer
  - socket.io

3. **Configure environment variables:**
   - Create `.env` files in `client` and `server` folders as needed.

4. **Run the application:**
   - Start backend:
     ```powershell
     npm start
     ```
   - Start frontend:
     ```powershell
     cd ../client
     npm run dev
     ```

## Folder Structure
```
client/      # Frontend React app
server/      # Backend Express app
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

## Author
- [pawanraje16](https://github.com/pawanraje16)
