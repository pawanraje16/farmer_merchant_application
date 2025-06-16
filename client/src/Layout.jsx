import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { FeedProvider } from "./context/FeedContext";

function Layout() {
    return (
        <>
        
            <Navbar/>
            <Outlet/>
        
        </>
    )
}

export default Layout