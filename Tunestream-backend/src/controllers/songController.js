import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";
import ApiError from "../utils/ApiError.js";

import userModel from "../models/userModel.js";
import historyModel from "../models/historyModel.js";

// ── Helper: log to history ──────────────────────────────────────────────────
const logHistory = async (user, action, itemName, itemType) => {
  const adminId = user.role === 'admin' ? user._id : user.adminId;
  if (!adminId) return;
  try {
    await historyModel.create({ userId: user._id, adminId, action, itemName, itemType });
  } catch (_) {}
};

// ADD SONG
const addSong = async (req, res, next) => {
  try {
    const { name, desc, album, songUrl, imageUrl } = req.body;
    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.image?.[0];

    if (!name || !desc || !album) {
      throw new ApiError(400, "Name, description, and album are required");
    }
    
    if (!audioFile && !songUrl) {
      throw new ApiError(400, "Either an audio file or a song URL is required");
    }

    let finalAudioUrl = "";
    let finalImageUrl = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
    let duration = "3:00";

    if (audioFile) {
      const audioUpload = await cloudinary.uploader.upload(
        audioFile.path,
        { resource_type: "video" }
      );
      finalAudioUrl = audioUpload.secure_url;
      duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
        audioUpload.duration % 60
      )}`;
    } else {
      finalAudioUrl = songUrl;
    }

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(
        imageFile.path,
        { resource_type: "image" }
      );
      finalImageUrl = imageUpload.secure_url;
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
    }

    const songData = {
      name,
      desc,
      album,
      image: finalImageUrl,
      file: finalAudioUrl,
      duration,
      userId: req.user._id
    };

    const song = new songModel(songData);
    await song.save();

    await logHistory(req.user, "ADDED_SONG", name, "Song");

    res.json({ success: true, message: "Song Added", song });
  } catch (error) {
    next(error); 
  }
};

// LIST SONG
const listSong = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
       // Guests can see all songs for the library
       const allSongs = await songModel.find({});
       return res.json({ success: true, songs: allSongs });
    }

    let queryIds = [userId];
    let queryFilter = { userId: { $in: queryIds } };

    if (req.user.role === "admin") {
      // If admin, find all users managed by this admin
      const managedUsers = await userModel.find({ adminId: userId }).select("_id");
      const managedUserIds = managedUsers.map(u => u._id);
      queryIds = [...queryIds, ...managedUserIds];
      
      // Admins can see their songs and their users' songs
      queryFilter = { userId: { $in: queryIds } };
    }

    const allSongs = await songModel.find(queryFilter);
    res.json({ success: true, songs: allSongs });
  } catch (error) {
    next(error);
  }
};

// REMOVE SONG
const removeSong = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new ApiError(400, "Song ID required");
    }

    const song = await songModel.findById(id);
    if (!song) {
      throw new ApiError(404, "Song not found");
    }

    // Check if requester is owner
    let isAuthorized = song.userId.toString() === req.user._id.toString();

    // If not owner but is admin, check if the song belongs to a managed user
    if (!isAuthorized && req.user.role === "admin") {
      const managedUsers = await userModel.find({ adminId: req.user._id }).select("_id");
      const managedUserIds = managedUsers.map(u => u._id.toString());
      if (managedUserIds.includes(song.userId.toString())) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new ApiError(403, "Not authorized to delete this song");
    }

    await songModel.findByIdAndDelete(id);

    // If the person who deleted it is an admin, the log belongs to them.
    // If they are a user, the log belongs to their admin.
    await logHistory(req.user, "DELETED_SONG", song.name, "Song");

    res.json({ success: true, message: "Song Removed" });
  } catch (error) {
    next(error);
  }
};

export { addSong, listSong, removeSong };