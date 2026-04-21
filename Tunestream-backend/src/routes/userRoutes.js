import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  refreshToken,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// SESSION
router.get("/me", protect, getMe);
router.get("/refresh", refreshToken);

export default router;