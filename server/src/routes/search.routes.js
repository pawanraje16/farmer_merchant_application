import { Router } from "express";
import { searchSuggestions, searchPosts, searchUsers } from "../controllers/search.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Search suggestions (for autocomplete)
router.route("/suggestions").get(verifyJWT, searchSuggestions);

// Search posts with filters
router.route("/posts").get(verifyJWT, searchPosts);

// Search users
router.route("/users").get(verifyJWT, searchUsers);

export default router;