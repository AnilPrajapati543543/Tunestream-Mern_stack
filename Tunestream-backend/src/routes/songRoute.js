import express from "express";
import { addSong, listSong, removeSong } from "../controllers/songController.js";
import upload from "../middleware/multer.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin-only routes
router.post(
  "/add",
  protect,
  authorizeRoles("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  addSong
);

router.post("/remove", protect, authorizeRoles("admin"), removeSong);

// Public route
router.get("/list", listSong);

export default router;