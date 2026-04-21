import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";
import ApiError from "../utils/ApiError.js";

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
    };

    const album = new albumModel(albumData);
    await album.save();

    res.json({ success: true, message: "Album Added", album });
  } catch (error) {
    next(error); // 
  }
};

// LIST ALBUM
const listAlbum = async (req, res, next) => {
  try {
    const allAlbums = await albumModel.find({});
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

    await albumModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Album Removed" });
  } catch (error) {
    next(error);
  }
};

export { addAlbum, listAlbum, removeAlbum };