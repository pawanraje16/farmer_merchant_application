import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use(express.json({limit: "1mb"}))
app.use(express.urlencoded({extended: true, limit:"1mb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import 

import userRouter from './routes/user.routes.js'
import postRouter from "./routes/post.routes.js"
import { addressRouter } from "./routes/address.route.js"

// routes declaration
app.use("/api/v1/users", userRouter)
//http://localhost:4000/api/v1/users/register

// post Routes
app.use("/api/v1/post", postRouter)

// address Routes
app.use("/api/v1/address",addressRouter)

export { app }