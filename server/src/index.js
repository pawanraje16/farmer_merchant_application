import dotenv from "dotenv";

import { app } from "./app.js";
import connectDB from "./db/index.js";
import { createServer } from "http";
import {Server} from "socket.io";

dotenv.config({
    path:'./env'
})


const httpServer = createServer(app);

// Initialize socket.io server
export const io = new Server(httpServer, {
    cors: {
        origin: ["https://farmermerchantconnection.vercel.app", "http://localhost:5173"],
        credentials: true
    }
});

// Store online users
export const userSocketMap ={}; 

// 
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("New user connectd:", userId);

    if(userId) userSocketMap[userId] = socket.id;
    
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


 await connectDB()
.then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running is at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
app.get('/', (req, res) => res.send("API is Working"));


// Export server for vercel
export default httpServer;