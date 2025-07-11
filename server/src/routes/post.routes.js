import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, getAllPosts, getLoggedInUserPosts, getPostById, getUserPosts } from "../controllers/post.controller.js";


const postRouter = Router()

postRouter.route("/create-post").post(
    verifyJWT,
    upload.fields([
        {
            name: "images",
            maxCount: 5,
        },
    ]),
    createPost
);

postRouter.route("/feed").get(verifyJWT,getAllPosts);
postRouter.route("/current-posts").get(verifyJWT,getLoggedInUserPosts);
postRouter.route("/user-posts/:username").get(verifyJWT,getUserPosts);
postRouter.route("/:postId").get(verifyJWT,getPostById);




export default postRouter;