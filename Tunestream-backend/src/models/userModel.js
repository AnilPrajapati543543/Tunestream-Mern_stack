import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    select: false 
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  inviteCode: {
    type: String,
    default: null
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  lastLogin: {
    type: Date,
    default: null
  },
  lastLogout: {
    type: Date,
    default: null
  },
  totalSessionTime: {
    type: Number,
    default: 0 // in seconds
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);