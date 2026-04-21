import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import Joi from "joi";
import { sendAccessToken, sendRefreshToken } from "../utils/sendToken.js";

// ================= JOI VALIDATION =================
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// ================= TOKEN GENERATION =================
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

// ================= REGISTER =================
export const registerUser = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return next(new ApiError(400, error.details[0].message));

    const { name, email, password } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: email === "admin@test.com" ? "admin" : "user"
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    sendAccessToken(res, accessToken);
    sendRefreshToken(res, refreshToken);

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return next(new ApiError(400, error.details[0].message));

    const { email, password } = value;

    // Hardcoded Admin Check
    const adminEmail = process.env.ADMIN_EMAIL || "admin@tune.com";
    const adminPass = process.env.ADMIN_PASSWORD || "900427";

    if (email === adminEmail && password === adminPass) {
      let user = await User.findOne({ email }).select("+role");
      
      if (!user) {
        // Create admin if not exists
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
          name: "Admin",
          email,
          password: hashedPassword,
          role: "admin"
        });
      } else if (user.role !== "admin") {
        // Update role if user exists but not admin
        user.role = "admin";
        await user.save();
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      sendAccessToken(res, accessToken);
      sendRefreshToken(res, refreshToken);

      return res.json({
        success: true,
        accessToken, // Include token in body
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    const user = await User.findOne({ email }).select("+password +role");
    if (!user) {
      return next(new ApiError(401, "Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError(401, "Invalid email or password"));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set cookies
    sendAccessToken(res, accessToken);
    sendRefreshToken(res, refreshToken);

    return res.json({
      success: true,
      accessToken, // Include token in body
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
    });
  } catch (err) {
    next(err);
  }
};

// ================= REFRESH TOKEN =================
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken(user);

    sendAccessToken(res, accessToken);

    return res.json({ success: true });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ================= GET CURRENT USER =================
export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

// ================= LOGOUT =================
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};