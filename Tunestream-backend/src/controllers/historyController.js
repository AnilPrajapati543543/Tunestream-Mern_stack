import historyModel from "../models/historyModel.js";
import userModel from "../models/userModel.js";

// GET HISTORY FOR ADMIN'S USERS
export const getAdminHistory = async (req, res, next) => {
  try {
    const adminId = req.user._id;

    // Optional: get history for a specific user under this admin
    const { userId } = req.query;

    let filter = { adminId };
    
    if (userId) {
      // Verify that this user belongs to this admin
      const user = await userModel.findOne({ _id: userId, adminId });
      if (!user) {
        return res.status(403).json({ success: false, message: "Unauthorized or User not found" });
      }
      filter.userId = userId;
    }

    // Populate user info to display their name
    const history = await historyModel.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};
