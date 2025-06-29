import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { followUser } from "../controllers/follow.controller.js";



const followRouter = Router();

followRouter.post("/follow/:username", verifyJWT, followUser);


export default followRouter