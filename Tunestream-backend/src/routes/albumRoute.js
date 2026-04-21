import express from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum
} from "../controllers/albumController.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import upload from "../middleware/multer.js";
import protect from "../middleware/authMiddleware.js";

const albumRouter = express.Router();

// Public Routes
albumRouter.get("/list", listAlbum);

// Protected Routes
albumRouter.post("/add", protect, upload.single("image"), addAlbum);
albumRouter.delete("/:id", protect, authorizeRoles("admin"), removeAlbum); 

export default albumRouter;