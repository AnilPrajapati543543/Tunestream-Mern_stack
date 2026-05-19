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
  updateArtistProfile,
  getArtistProfileByName,
  submitFeedback
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/submit-feedback", protect, submitFeedback);


// SESSION
router.get("/me", protect, getMe);
router.get("/refresh", refreshToken);
router.get("/linked", protect, getLinkedUsers);
router.delete("/linked/:id", protect, removeLinkedUser);

// ARTIST PROFILE
router.put("/artist-profile", protect, updateArtistProfile);
router.get("/artist/:name", getArtistProfileByName);

// PASSWORD RESET
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;