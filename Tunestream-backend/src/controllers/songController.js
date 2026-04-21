import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";
import ApiError from "../utils/ApiError.js";

// ADD SONG
const addSong = async (req, res, next) => {
  try {
    const { name, desc, album } = req.body;
    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.image?.[0];

    if (!name || !desc || !album || !audioFile || !imageFile) {
      throw new ApiError(400, "All fields are required");
    }

    const audioUpload = await cloudinary.uploader.upload(
      audioFile.path,
      { resource_type: "video" }
    );

    const imageUpload = await cloudinary.uploader.upload(
      imageFile.path,
      { resource_type: "image" }
    );

    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
      audioUpload.duration % 60
    )}`;

    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    };

    const song = new songModel(songData);
    await song.save();

    res.json({ success: true, message: "Song Added", song });
  } catch (error) {
    next(error); 
  }
};

// LIST SONG
const listSong = async (req, res, next) => {
  try {
    const allSongs = await songModel.find({});
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

    await songModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Song Removed" });
  } catch (error) {
    next(error);
  }
};

export { addSong, listSong, removeSong };