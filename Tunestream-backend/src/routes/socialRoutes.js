import express from "express";
import { 
  followUser, 
  unfollowUser, 
  getSocialFeed, 
  getPublicProfile, 
  getRooms, 
  createRoom, 
  joinRoom, 
  syncRoom 
} from "../controllers/socialController.js";
import protect from "../middleware/authMiddleware.js";

const socialRouter = express.Router();

// User relation routes
socialRouter.post("/follow/:id", protect, followUser);
socialRouter.post("/unfollow/:id", protect, unfollowUser);
socialRouter.get("/feed", protect, getSocialFeed);
socialRouter.get("/profile/:id", protect, getPublicProfile);

// Listening Rooms routes
socialRouter.get("/rooms", protect, getRooms);
socialRouter.post("/rooms/create", protect, createRoom);
socialRouter.post("/rooms/join/:roomId", protect, joinRoom);
socialRouter.post("/rooms/sync/:roomId", protect, syncRoom);

export default socialRouter;
