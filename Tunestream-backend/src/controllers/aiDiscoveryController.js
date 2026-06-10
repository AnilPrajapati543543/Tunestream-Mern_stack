import Song from "../models/songModel.js";

// Mapping keywords to mood matching tags
const moodKeywords = {
  chill: ["lofi", "relax", "ambient", "night", "study", "sleep", "slow", "peaceful", "calm"],
  study: ["lofi", "relax", "focus", "piano", "instrumental", "ambient", "calm"],
  gym: ["gym", "workout", "energy", "energetic", "power", "fast", "beat", "upbeat", "dance", "rock"],
  workout: ["gym", "workout", "energy", "energetic", "power", "fast", "beat", "upbeat", "dance"],
  sad: ["sad", "cry", "lonely", "emotional", "slow", "melancholy"],
  happy: ["happy", "dance", "fun", "summer", "upbeat", "joy", "cheerful"],
  romantic: ["love", "romantic", "heart", "slow", "sweet", "ballad"],
  party: ["party", "dance", "club", "electronic", "edm", "remix", "upbeat"]
};

export const aiSearch = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const cleanPrompt = prompt.toLowerCase();
    const allSongs = await Song.find({});
    
    // Simple relevance scoring
    const scoredSongs = allSongs.map(song => {
      let score = 0;
      const title = song.name.toLowerCase();
      const desc = song.desc.toLowerCase();
      const album = song.album.toLowerCase();

      // Direct match on prompt words
      const words = cleanPrompt.split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) {
          if (title.includes(word)) score += 5;
          if (desc.includes(word)) score += 3;
          if (album.includes(word)) score += 2;
        }
      });

      // Match mood keywords
      Object.keys(moodKeywords).forEach(mood => {
        if (cleanPrompt.includes(mood)) {
          const keywords = moodKeywords[mood];
          keywords.forEach(kw => {
            if (title.includes(kw) || desc.includes(kw) || album.includes(kw)) {
              score += 4;
            }
          });
        }
      });

      return { song, score };
    });

    // Sort by score and filter out zero scores unless no matches found (then fallback)
    let matches = scoredSongs
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.song);

    // Fallback if no direct keyword match: return a subset of available songs randomized to mock an AI compilation
    if (matches.length === 0) {
      matches = allSongs.sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    // Generate a title for the AI playlist
    let playlistTitle = "AI Discovery: Mood Mix";
    if (cleanPrompt.includes("study") || cleanPrompt.includes("night")) {
      playlistTitle = "AI study session at night 🌙";
    } else if (cleanPrompt.includes("gym") || cleanPrompt.includes("workout") || cleanPrompt.includes("energetic")) {
      playlistTitle = "AI High-Octane Workout ⚡";
    } else if (cleanPrompt.includes("sad") || cleanPrompt.includes("slow")) {
      playlistTitle = "AI Melancholy & Chill 🌧️";
    } else if (cleanPrompt.includes("happy") || cleanPrompt.includes("party") || cleanPrompt.includes("dance")) {
      playlistTitle = "AI Dance & Euphoria 🎉";
    } else {
      // capitalize first letter of prompt
      playlistTitle = `AI: ${prompt.charAt(0).toUpperCase() + prompt.slice(1)}`;
    }

    return res.json({
      success: true,
      playlistTitle,
      prompt,
      songs: matches
    });
  } catch (error) {
    next(error);
  }
};
