import User from "../models/userModel.js";
import PlayLog from "../models/playLogModel.js";
import Room from "../models/roomModel.js";
import Playlist from "../models/playlistModel.js";

// ================= FOLLOW USER =================
export const followUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Add to following
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId }
    });

    // Add to target's followers
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId }
    });

    return res.json({ success: true, message: `Successfully followed ${targetUser.name}` });
  } catch (error) {
    next(error);
  }
};

// ================= UNFOLLOW USER =================
export const unfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove from following
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId }
    });

    // Remove from target's followers
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId }
    });

    return res.json({ success: true, message: `Successfully unfollowed ${targetUser.name}` });
  } catch (error) {
    next(error);
  }
};

// ================= SOCIAL FEED =================
export const getSocialFeed = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser || !currentUser.following || currentUser.following.length === 0) {
      // Return a simulated mock feed of active public platform users if they don't follow anyone yet
      const randomUsers = await User.find({ _id: { $ne: currentUserId } }).limit(4);
      const mockFeed = randomUsers.map((u, i) => {
        const songs = [
          { name: "Let's Nacho", artist: "Badshah", time: "2 minutes ago" },
          { name: "Despacito", artist: "Luis Fonsi", time: "10 minutes ago" },
          { name: "Lomberghini", artist: "The Doorbeen", time: "1 hour ago" },
          { name: "Kahani Suno", artist: "Kaifi Khalil", time: "3 hours ago" }
        ];
        return {
          user: { _id: u._id, name: u.name, level: u.level || 1 },
          songName: songs[i % songs.length].name,
          artistName: songs[i % songs.length].artist,
          playedAt: new Date(Date.now() - (i * 20 * 60000))
        };
      });

      return res.json({ success: true, feed: mockFeed });
    }

    // Get logs of followed users
    const feedLogs = await PlayLog.find({ userId: { $in: currentUser.following } })
      .populate("userId", "name level")
      .sort({ playedAt: -1 })
      .limit(20);

    const feed = feedLogs.map(log => ({
      user: log.userId,
      songName: log.songName,
      artistName: log.artistName,
      playedAt: log.playedAt
    }));

    return res.json({ success: true, feed });
  } catch (error) {
    next(error);
  }
};

// ================= GET USER PUBLIC PROFILE =================
export const getPublicProfile = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const targetUser = await User.findById(targetUserId).select("-password -email");

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const playlists = await Playlist.find({ userId: targetUserId, isCollaborative: false }).limit(5);

    return res.json({
      success: true,
      profile: {
        id: targetUser._id,
        name: targetUser.name,
        level: targetUser.level || 1,
        xp: targetUser.xp || 0,
        badges: targetUser.badges || [],
        followersCount: targetUser.followers ? targetUser.followers.length : 0,
        followingCount: targetUser.following ? targetUser.following.length : 0,
        isFollowed: req.user ? targetUser.followers.includes(req.user._id) : false
      },
      playlists
    });
  } catch (error) {
    next(error);
  }
};

// ================= LISTING ROOMS =================
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({})
      .populate("hostId", "name level")
      .populate("participants", "name")
      .populate("currentSongId");

    return res.json({ success: true, rooms });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { name } = req.body;
    const hostId = req.user._id;

    if (!name) {
      return res.status(400).json({ success: false, message: "Room name is required" });
    }

    // Delete any existing room hosted by this user to avoid duplication
    await Room.deleteMany({ hostId });

    const room = await Room.create({
      name,
      hostId,
      participants: [hostId]
    });

    return res.status(201).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

export const joinRoom = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Add user to participants array
    const updatedRoom = await Room.findByIdAndUpdate(roomId, {
      $addToSet: { participants: userId }
    }, { new: true })
      .populate("hostId", "name level")
      .populate("participants", "name");

    return res.json({ success: true, room: updatedRoom });
  } catch (error) {
    next(error);
  }
};

export const syncRoom = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const hostId = req.user._id;
    const { currentSongId, isPlaying, progress } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    if (room.hostId.toString() !== hostId.toString()) {
      return res.status(403).json({ success: false, message: "Only the host can sync room playback states" });
    }

    room.currentSongId = currentSongId || null;
    room.isPlaying = isPlaying ?? false;
    room.progress = progress || 0;
    await room.save();

    return res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};
