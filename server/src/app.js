import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "1mb"}))
app.use(express.urlencoded({extended: true, limit:"1mb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import 

import userRouter from './routes/user.routes.js'
import postRouter from "./routes/post.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter)
//http://localhost:4000/api/v1/users/register

// post Routes
app.use("/api/v1/post", postRouter)

export { app }