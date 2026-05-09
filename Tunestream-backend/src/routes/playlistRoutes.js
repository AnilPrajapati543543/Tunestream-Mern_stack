import express from "express";
import { 
  createPlaylist, 
  getUserPlaylists, 
  addSongToPlaylist, 
  removeSongFromPlaylist, 
  deletePlaylist 
} from "../controllers/playlistController.js";
import protect from "../middleware/authMiddleware.js";

const playlistRouter = express.Router();

playlistRouter.post("/create", protect, createPlaylist);
playlistRouter.get("/list", protect, getUserPlaylists);
playlistRouter.post("/add-song", protect, addSongToPlaylist);
playlistRouter.post("/remove-song", protect, removeSongFromPlaylist);
playlistRouter.delete("/:id", protect, deletePlaylist);

export default playlistRouter;
