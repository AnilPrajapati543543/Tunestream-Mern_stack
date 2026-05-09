import playlistModel from "../models/playlistModel.js";
import songModel from "../models/songModel.js";
import historyModel from "../models/historyModel.js";
import ApiError from "../utils/ApiError.js";

// ── Helper: log to history ──────────────────────────────────────────────────
const logHistory = async (user, action, itemName, itemType) => {
  // If the performer is an admin, the log belongs to them.
  // If they are a user, the log belongs to their linked admin.
  const adminId = user.role === 'admin' ? user._id : user.adminId;
  
  if (!adminId) return; 
  try {
    await historyModel.create({ userId: user._id, adminId, action, itemName, itemType });
  } catch (_) {
    // non-fatal
  }
};

// CREATE PLAYLIST
export const createPlaylist = async (req, res, next) => {
  try {
    const { name, desc } = req.body;
    if (!name) throw new ApiError(400, "Playlist name is required");

    const playlist = new playlistModel({
      name,
      desc,
      userId: req.user._id,
      songs: []
    });

    await playlist.save();

    // Log to admin history
    await logHistory(
      req.user,
      "CREATED_PLAYLIST",
      name,
      "Playlist"
    );

    res.json({ success: true, playlist, message: "Playlist created" });
  } catch (error) {
    next(error);
  }
};

// GET USER PLAYLISTS
export const getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await playlistModel.find({ userId: req.user._id }).populate("songs");
    res.json({ success: true, playlists });
  } catch (error) {
    next(error);
  }
};

// ADD SONG TO PLAYLIST
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await playlistModel.findOne({ _id: playlistId, userId: req.user._id });
    if (!playlist) throw new ApiError(404, "Playlist not found");

    const song = await songModel.findById(songId);
    if (!song) throw new ApiError(404, "Song not found");

    if (!playlist.songs.map(s => s.toString()).includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();

      // Log to admin history
      await logHistory(
        req.user,
        "ADDED_TO_PLAYLIST",
        `${song.name} (to "${playlist.name}")`,
        "Song"
      );
    }

    // Re-populate so client gets full song objects
    const populated = await playlistModel.findById(playlist._id).populate("songs");
    res.json({ success: true, message: "Song added to playlist", playlist: populated });
  } catch (error) {
    next(error);
  }
};

// REMOVE SONG FROM PLAYLIST
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await playlistModel.findOne({ _id: playlistId, userId: req.user._id });
    if (!playlist) throw new ApiError(404, "Playlist not found");

    // Get the song name for history before removing
    const song = await songModel.findById(songId);

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId.toString());
    await playlist.save();

    // Log to admin history
    await logHistory(
      req.user,
      "REMOVED_FROM_PLAYLIST",
      song ? `${song.name} (from "${playlist.name}")` : `Song (from "${playlist.name}")`,
      "Song"
    );

    const populated = await playlistModel.findById(playlist._id).populate("songs");
    res.json({ success: true, message: "Song removed from playlist", playlist: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE PLAYLIST
export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const playlist = await playlistModel.findOne({ _id: id, userId: req.user._id });
    if (!playlist) throw new ApiError(404, "Playlist not found");

    await playlistModel.findByIdAndDelete(id);

    // Log to admin history
    await logHistory(
      req.user,
      "DELETED_PLAYLIST",
      playlist.name,
      "Playlist"
    );

    res.json({ success: true, message: "Playlist deleted" });
  } catch (error) {
    next(error);
  }
};
