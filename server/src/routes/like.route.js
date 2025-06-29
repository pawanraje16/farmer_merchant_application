import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {  likePost, unlikePost } from "../controllers/like.controller.js";



const likeRouter = Router()

likeRouter.post("/like/:postId", verifyJWT, likePost);
likeRouter.delete("/unlike/:postId", verifyJWT, unlikePost);


export default likeRouter;