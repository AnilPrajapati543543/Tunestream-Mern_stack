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
    enum: ["user", "admin", "artist"],
    default: "user"
  },
  artistBio: {
    type: String,
    default: ""
  },
  artistImage: {
    type: String,
    default: ""
  },
  monthlyListeners: {
    type: Number,
    default: 0
  },
  followersCount: {
    type: Number,
    default: 0
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
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    type: String
  }],
  dailyChallenges: [{
    id: String,
    title: String,
    target: Number,
    current: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    xpReward: Number
  }]

}, { timestamps: true });

export default mongoose.model("User", userSchema);