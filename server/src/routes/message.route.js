import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const messageRouter = express.Router();

messageRouter.get("/users", verifyJWT, getUsersForSidebar);
messageRouter.get("/:id", verifyJWT, getMessage);
messageRouter.put("/mark/:id", verifyJWT, markMessageAsSeen);
messageRouter.post("/send/:id", verifyJWT ,  upload.fields([
        {
            name: "image",
            maxCount: 1,
        },
    ]), sendMessage);

export default messageRouter;