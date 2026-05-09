import express from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum
} from "../controllers/albumController.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import upload from "../middleware/multer.js";
import protect from "../middleware/authMiddleware.js";
import optionalProtect from "../middleware/optionalAuth.js";

const albumRouter = express.Router();

// Optional Protected Routes
albumRouter.get("/list", optionalProtect, listAlbum);

// Protected Routes
albumRouter.post("/add", protect, authorizeRoles("admin", "user"), upload.single("image"), addAlbum);
albumRouter.delete("/:id", protect, authorizeRoles("admin", "user"), removeAlbum); 

export default albumRouter;