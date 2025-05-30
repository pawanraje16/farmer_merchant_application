import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import Market from './pages/Market.jsx'
import Profile from './pages/Profile.jsx'
import Layout from './Layout.jsx'
import { Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Crops from './pages/Crops.jsx'
import Chat from './pages/Chat.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PublicProfile from './pages/PublicProfile.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
       <>
      {/* Auth Routes - No Layout/Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App Routes with Layout/Navbar */}
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="crops" element={<Crops />} />
        <Route path="market" element={<Market />} />
        <Route path="profile" element={<Profile />} />
        <Route path="user/:userId" element={<PublicProfile />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:userId" element={<Chat />} />
      </Route>
    </>,
  ),
)

createRoot(document.getElementById('root')).render(
  
    <AppContextProvider>
      <RouterProvider router={router}/>
    </AppContextProvider>
    
  
)
