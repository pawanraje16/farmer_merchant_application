import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, getAllPosts, getPostById } from "../controllers/post.controller.js";


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
postRouter.route("/:postId").get(verifyJWT,getPostById);




export default postRouter;