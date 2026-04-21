import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";

// ================= PROTECT MIDDLEWARE =================
const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return next(new ApiError(401, "Not authenticated"));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(new ApiError(401, "Invalid or expired token"));
    }

    // Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    return next(new ApiError(500, "Server error"));
  }
};

export default protect;