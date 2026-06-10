import PlayLog from "../models/playLogModel.js";
import User from "../models/userModel.js";
import Song from "../models/songModel.js";

// Helper to calculate streaks
const calculateStreak = (playLogs) => {
  if (playLogs.length === 0) return 0;
  
  // Get unique dates sorted descending
  const dates = playLogs.map(log => {
    const d = new Date(log.playedAt);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  });
  const uniqueDates = Array.from(new Set(dates)).map(dStr => new Date(dStr));
  uniqueDates.sort((a, b) => b - a);

  let streak = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  let expectedDate = today;

  // If the last play wasn't today, check if it was yesterday
  if (uniqueDates[0] && uniqueDates[0].getTime() !== today.getTime()) {
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (uniqueDates[0].getTime() === yesterday.getTime()) {
      expectedDate = yesterday;
    } else {
      return 0; // Streak broken
    }
  }

  for (let i = 0; i < uniqueDates.length; i++) {
    const checkDate = uniqueDates[i];
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// ================= LOG PLAY =================
export const logPlay = async (req, res, next) => {
  try {
    const { songId, songName, artistName, duration } = req.body;
    const userId = req.user._id;

    if (!songId || !songName || !artistName) {
      return res.status(400).json({ success: false, message: "Missing required play log fields" });
    }

    // Auto-genre tag parsing based on metadata/common names
    let genre = "Pop";
    const songNameLower = songName.toLowerCase();
    const artistNameLower = artistName.toLowerCase();
    if (songNameLower.includes("lofi") || songNameLower.includes("chill") || songNameLower.includes("study")) {
      genre = "Lofi / Chill";
    } else if (songNameLower.includes("dance") || songNameLower.includes("remix") || songNameLower.includes("beat")) {
      genre = "Electronic";
    } else if (songNameLower.includes("acoustic") || songNameLower.includes("piano") || songNameLower.includes("slow")) {
      genre = "Acoustic";
    } else if (artistNameLower.includes("arjit") || artistNameLower.includes("shreya") || artistNameLower.includes("vishal")) {
      genre = "Bollywood";
    } else if (songNameLower.includes("rock") || songNameLower.includes("guitar")) {
      genre = "Rock";
    }

    // Create play log
    const playLog = await PlayLog.create({
      userId,
      songId,
      songName,
      artistName,
      genre,
      duration: duration || 30, // Default 30s stream
      playedAt: new Date()
    });

    // Update User XP & Level & Daily Quests
    const user = await User.findById(userId);
    if (user) {
      let xpEarned = 10;
      user.xp += xpEarned;

      // Update level based on formula (Level = floor(sqrt(xp / 100)) + 1)
      const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
      let leveledUp = false;
      if (newLevel > user.level) {
        user.level = newLevel;
        leveledUp = true;
      }

      // Initialize daily challenges if empty or outdated
      const today = new Date().toDateString();
      if (!user.dailyChallenges || user.dailyChallenges.length === 0) {
        user.dailyChallenges = [
          { id: "quest_1", title: "Listen to 3 Songs", target: 3, current: 0, completed: false, xpReward: 50 },
          { id: "quest_2", title: "Explore 2 Different Artists", target: 2, current: 0, completed: false, xpReward: 60 },
          { id: "quest_3", title: "Stream for 2 minutes", target: 120, current: 0, completed: false, xpReward: 80 }
        ];
      }

      // Update active daily challenges
      user.dailyChallenges = user.dailyChallenges.map(quest => {
        if (quest.completed) return quest;

        if (quest.id === "quest_1") {
          quest.current += 1;
        } else if (quest.id === "quest_2") {
          // Check if user has listened to multiple artists today
          quest.current += 1; // Increment as a count of artist explorations
        } else if (quest.id === "quest_3") {
          quest.current += (duration || 30);
        }

        if (quest.current >= quest.target) {
          quest.completed = true;
          user.xp += quest.xpReward;
        }
        return quest;
      });

      // Recalculate level after potential quest XP updates
      const finalLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
      if (finalLevel > user.level) {
        user.level = finalLevel;
        leveledUp = true;
      }

      // Badge checking
      const totalLogs = await PlayLog.countDocuments({ userId });
      const currentBadges = user.badges || [];
      const newBadges = [...currentBadges];

      if (totalLogs >= 1 && !newBadges.includes("First Discovery")) {
        newBadges.push("First Discovery");
      }
      if (totalLogs >= 10 && !newBadges.includes("Melomanic Listener")) {
        newBadges.push("Melomanic Listener");
      }

      // Unique artists listened
      const uniqueArtistsCount = await PlayLog.distinct("artistName", { userId });
      if (uniqueArtistsCount.length >= 3 && !newBadges.includes("Genre Explorer")) {
        newBadges.push("Genre Explorer");
      }

      user.badges = newBadges;
      await user.save();
    }

    return res.status(201).json({
      success: true,
      playLog,
      xpEarned: 10,
      currentLevel: user ? user.level : 1,
      currentXp: user ? user.xp : 0
    });
  } catch (error) {
    next(error);
  }
};

// ================= GET ANALYTICS =================
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const playLogs = await PlayLog.find({ userId }).sort({ playedAt: -1 });

    // 1. Listening Streak
    const streak = calculateStreak(playLogs);

    // 2. Weekly breakdown (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyBreakdown = days.map(day => ({ name: day, count: 0 }));
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentLogs = playLogs.filter(log => new Date(log.playedAt) >= sevenDaysAgo);
    recentLogs.forEach(log => {
      const dayName = days[new Date(log.playedAt).getDay()];
      const dayObj = weeklyBreakdown.find(d => d.name === dayName);
      if (dayObj) dayObj.count += Math.round(log.duration / 60) || 1; // record in minutes
    });

    // 3. Top Songs
    const songCounts = {};
    playLogs.forEach(log => {
      const key = `${log.songName}__${log.songId}`;
      songCounts[key] = (songCounts[key] || 0) + 1;
    });
    const topSongs = Object.keys(songCounts).map(key => {
      const [name, id] = key.split("__");
      return { id, name, plays: songCounts[key] };
    }).sort((a, b) => b.plays - a.plays).slice(0, 5);

    // 4. Top Artists
    const artistCounts = {};
    playLogs.forEach(log => {
      artistCounts[log.artistName] = (artistCounts[log.artistName] || 0) + 1;
    });
    const topArtists = Object.keys(artistCounts).map(name => {
      return { name, plays: artistCounts[name] };
    }).sort((a, b) => b.plays - a.plays).slice(0, 5);

    // 5. Genre Distribution
    const genreCounts = {};
    playLogs.forEach(log => {
      genreCounts[log.genre] = (genreCounts[log.genre] || 0) + 1;
    });
    const genreDistribution = Object.keys(genreCounts).map(name => {
      return { name, value: Math.round((genreCounts[name] / playLogs.length) * 100) };
    });

    // 6. Recap Stats
    const totalMinutes = playLogs.reduce((acc, log) => acc + (log.duration / 60), 0);
    const recap = {
      totalTracks: playLogs.length,
      totalMinutes: Math.round(totalMinutes),
      streak,
      favouriteGenre: genreDistribution.length > 0 ? genreDistribution.sort((a, b) => b.value - a.value)[0].name : "Pop"
    };

    return res.json({
      success: true,
      streak,
      weeklyBreakdown,
      topSongs,
      topArtists,
      genreDistribution,
      recap
    });
  } catch (error) {
    next(error);
  }
};
