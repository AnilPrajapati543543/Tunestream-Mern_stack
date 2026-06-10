import mongoose from "mongoose";

const playLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'song',
    required: true
  },
  songName: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    default: "Pop"
  },
  playedAt: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true // in seconds
  }
}, { timestamps: true });

const playLogModel = mongoose.models.PlayLog || mongoose.model("PlayLog", playLogSchema);
export default playLogModel;
