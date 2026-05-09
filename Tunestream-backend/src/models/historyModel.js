import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ["ADDED_SONG", "DELETED_SONG", "ADDED_ALBUM", "DELETED_ALBUM", "REMOVED_FROM_PLAYLIST", "DELETED_PLAYLIST", "CREATED_PLAYLIST", "ADDED_TO_PLAYLIST", "USER_JOINED", "REMOVED_USER"],
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  itemType: {
    type: String,
    enum: ["Song", "Album", "Playlist", "User"],
    required: true
  }
}, { timestamps: true });

const historyModel = mongoose.models.History || mongoose.model("History", historySchema);

export default historyModel;
