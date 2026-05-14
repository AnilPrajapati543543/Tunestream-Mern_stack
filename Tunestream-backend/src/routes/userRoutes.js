import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  refreshToken,
  getLinkedUsers,
  forgotPassword,
  resetPassword,
  removeLinkedUser,
  sendOTP,
  verifyOTP
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// SESSION
router.get("/me", protect, getMe);
router.get("/refresh", refreshToken);
router.get("/linked", protect, getLinkedUsers);
router.delete("/linked/:id", protect, removeLinkedUser);

// PASSWORD RESET
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;