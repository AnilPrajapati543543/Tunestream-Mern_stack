import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";
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

// ADD ALBUM
const addAlbum = async (req, res, next) => {
  try {
    const { name, desc, bgColour } = req.body;
    const imageFile = req.file;

    if (!name || !desc || !bgColour || !imageFile) {
      throw new ApiError(400, "All fields are required");
    }

    const imageUpload = await cloudinary.uploader.upload(
      imageFile.path,
      { resource_type: "image" }
    );

    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
      userId: req.user._id
    };

    const album = new albumModel(albumData);
    await album.save();

    await logHistory(req.user, "ADDED_ALBUM", name, "Album");

    res.json({ success: true, message: "Album Added", album });
  } catch (error) {
    next(error); // 
  }
};

// LIST ALBUM
const listAlbum = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
       // Guests can see all albums for the library
       const allAlbums = await albumModel.find({});
       return res.json({ success: true, albums: allAlbums });
    }

    let queryIds = [userId];
    let queryFilter = { userId: { $in: queryIds } };

    if (req.user.role === "admin") {
      // If admin, find all users managed by this admin
      const managedUsers = await userModel.find({ adminId: userId }).select("_id");
      const managedUserIds = managedUsers.map(u => u._id);
      queryIds = [...queryIds, ...managedUserIds];

      // Admins can see their albums and their users' albums
      queryFilter = { userId: { $in: queryIds } };
    }

    const allAlbums = await albumModel.find(queryFilter);
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    next(error);
  }
};

// REMOVE ALBUM
const removeAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Album ID required");
    }

    const album = await albumModel.findById(id);
    if (!album) {
      throw new ApiError(404, "Album not found");
    }

    // Check if requester is owner
    let isAuthorized = album.userId.toString() === req.user._id.toString();

    // If not owner but is admin, check if the album belongs to a managed user
    if (!isAuthorized && req.user.role === "admin") {
      const managedUsers = await userModel.find({ adminId: req.user._id }).select("_id");
      const managedUserIds = managedUsers.map(u => u._id.toString());
      if (managedUserIds.includes(album.userId.toString())) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new ApiError(403, "Not authorized to delete this album");
    }

    await albumModel.findByIdAndDelete(id);

    await logHistory(req.user, "DELETED_ALBUM", album.name, "Album");

    res.json({ success: true, message: "Album Removed" });
  } catch (error) {
    next(error);
  }
};

export { addAlbum, listAlbum, removeAlbum };