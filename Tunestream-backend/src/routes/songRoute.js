import express from "express";
import { addSong, listSong, removeSong } from "../controllers/songController.js";
import upload from "../middleware/multer.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Protected routes
router.post(
  "/add",
  protect,
  authorizeRoles("admin", "user"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  addSong
);

router.post("/remove", protect, authorizeRoles("admin", "user"), removeSong);

// Protected routes
router.get("/list", listSong);

export default router;