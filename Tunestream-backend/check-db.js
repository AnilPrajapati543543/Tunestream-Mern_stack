import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const songSchema = new mongoose.Schema({}, { strict: false });
const Song = mongoose.model("song", songSchema);

const albumSchema = new mongoose.Schema({}, { strict: false });
const Album = mongoose.model("album", albumSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    const songs = await Song.find({});
    console.log(`Found ${songs.length} songs.`);
    const songsWithoutUserId = songs.filter(s => !s.userId);
    console.log(`${songsWithoutUserId.length} songs are MISSING a userId.`);
    
    const albums = await Album.find({});
    console.log(`Found ${albums.length} albums.`);
    const albumsWithoutUserId = albums.filter(a => !a.userId);
    console.log(`${albumsWithoutUserId.length} albums are MISSING a userId.`);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
