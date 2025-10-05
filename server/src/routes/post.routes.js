import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, getAllPosts, getLoggedInUserPosts, getPostById, getUserPosts, deletePost, updatePostAvailability } from "../controllers/post.controller.js";


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
postRouter.route("/:postId").delete(verifyJWT,deletePost);
postRouter.route("/:postId/availability").patch(verifyJWT,updatePostAvailability);




export default postRouter;