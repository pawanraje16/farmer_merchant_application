import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { followUser, unfollowUser } from "../controllers/follow.controller.js";



const followRouter = Router();

followRouter.post("/follow/:username", verifyJWT, followUser);
followRouter.delete("/unfollow/:username", verifyJWT, unfollowUser);

export default followRouter