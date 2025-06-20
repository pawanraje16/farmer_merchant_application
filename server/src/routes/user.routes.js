import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changeCurrentPassword, getCurrentUser, getLoggedInUseProfile, getUserByUsername, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
   registerUser 
)

router.route("/login").post(loginUser)

//secured route when user is login

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/profile").get(verifyJWT,getLoggedInUseProfile);
router.get('/user/:username', verifyJWT, getUserByUsername);
export default router