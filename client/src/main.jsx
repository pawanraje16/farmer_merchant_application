import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
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
import PostDetail from './pages/PostDetail.jsx'
import ProductPost from './components/ProductPost.jsx'
import CreatePostPrompt from './components/CreatePostPrompt.jsx'
import CreatePost from './pages/CreatePost.jsx'
import { FeedProvider } from './context/FeedContext.jsx'
import {Toaster, toast} from "react-hot-toast"
import { AppProvider } from './context/AppProvider.jsx'

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
        <Route path="user/:username" element={<PublicProfile />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:userId" element={<Chat />} />
        <Route path="post/:postId" element={<PostDetail/>}/>
        <Route path="create-post" element={<CreatePost/>}/>
      </Route>
    </>,
  ),
)

createRoot(document.getElementById('root')).render(
  
 <AppProvider>
  <Toaster
          position="top-right"
          toastOptions={{
            className: "rounded-lg bg-gray-800 text-white text-sm px-4 py-3 shadow-lg",
            duration: 3500,
          }}
        />
    <RouterProvider router={router}>
    
    </RouterProvider>
 </AppProvider>  

)
