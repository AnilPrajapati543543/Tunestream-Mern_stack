import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentSongId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'song',
    default: null
  },
  isPlaying: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0 // current playback progress in seconds
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const roomModel = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default roomModel;
