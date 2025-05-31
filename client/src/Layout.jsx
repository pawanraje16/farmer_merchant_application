import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { FeedProvider } from "./context/FeedContext";

function Layout() {
    return (
        <>
        <Navbar/>
        <FeedProvider>
            <Outlet/>
        </FeedProvider>
        </>
    )
}

export default Layout