import User from "../models/userModel.js";
import historyModel from "../models/historyModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import Joi from "joi";
import { sendAccessToken, sendRefreshToken } from "../utils/sendToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// ================= JOI VALIDATION =================
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().min(10).optional(),
  role: Joi.string().valid("user", "admin").optional(),
  inviteCode: Joi.string().optional(),
}).or('email', 'phoneNumber');

const loginSchema = Joi.object({
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(10).optional(),
  password: Joi.string().min(6).required(),
}).or('email', 'phoneNumber');

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

    const { name, email, phoneNumber, password, role, inviteCode: reqInviteCode } = req.body;

    const existingUser = await User.findOne({ 
      $or: [
        { email: email || "___non_existent___" }, 
        { phoneNumber: phoneNumber || "___non_existent___" }
      ] 
    });
    if (existingUser) {
      return next(new ApiError(400, "User with this email or phone already exists"));
    }

    let finalRole = "user";
    let finalAdminId = null;
    let finalInviteCode = null;

    if (role === "admin") {
      finalRole = "admin";
      // Generate a simple 6-character uppercase invite code for the admin
      finalInviteCode = Math.random().toString(36).slice(-6).toUpperCase();
    } else {
      // It's a regular user, check if they provided an invite code to join an admin's group
      if (reqInviteCode) {
        const adminUser = await User.findOne({ inviteCode: reqInviteCode, role: "admin" });
        if (!adminUser) {
           return next(new ApiError(400, "Invalid invite code"));
        }

        // Enforce the 6-user limit per admin
        const count = await User.countDocuments({ adminId: adminUser._id });
        if (count >= 6) {
           return next(new ApiError(400, "This admin has reached the maximum limit of 6 users"));
        }

        finalAdminId = adminUser._id;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email || undefined,
      phoneNumber: phoneNumber || undefined,
      password: hashedPassword,
      role: finalRole,
      adminId: finalAdminId,
      inviteCode: finalInviteCode,
      lastLogin: new Date() 
    });

    if (finalAdminId) {
      await historyModel.create({
        userId: user._id,
        adminId: finalAdminId,
        action: "USER_JOINED",
        itemName: name,
        itemType: "User"
      });
    }

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
        adminId: user.adminId,
        inviteCode: user.inviteCode
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

    const { email, phoneNumber, password } = value;

    const user = await User.findOne({
      $or: [
        { email: email || "___non_existent___" },
        { phoneNumber: phoneNumber || "___non_existent___" }
      ]
    }).select("+password +role");

    if (!user) {
      return next(new ApiError(401, "Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError(401, "Invalid email or password"));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

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
        adminId: user.adminId,
        inviteCode: user.inviteCode
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
    user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        adminId: req.user.adminId,
        inviteCode: req.user.inviteCode
    },
  });
};

// ================= LOGOUT =================
export const logoutUser = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user && user.lastLogin) {
        const logoutTime = new Date();
        const sessionDuration = Math.round((logoutTime - user.lastLogin) / 1000);
        user.lastLogout = logoutTime;
        user.totalSessionTime = (user.totalSessionTime || 0) + sessionDuration;
        await user.save();
      }
    }

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
  } catch (err) {
    next(err);
  }
};

// ================= GET LINKED USERS =================
export const getLinkedUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ApiError(403, "Only admins can access linked users"));
    }

    const linkedUsers = await User.find({ adminId: req.user._id })
      .select("name email createdAt lastLogin lastLogout totalSessionTime")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: linkedUsers.length,
      users: linkedUsers
    });
  } catch (err) {
    next(err);
  }
};

// ================= REMOVE LINKED USER =================
export const removeLinkedUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ApiError(403, "Only admins can remove users"));
    }

    const userId = req.params.id;
    const userToRemove = await User.findById(userId);

    if (!userToRemove) {
      return next(new ApiError(404, "User not found"));
    }

    if (userToRemove.adminId?.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "You can only remove users linked to you"));
    }

    // Record the removal in history before deleting the user
    await historyModel.create({
      userId: userToRemove._id,
      adminId: req.user._id,
      action: "REMOVED_USER",
      itemName: userToRemove.name,
      itemType: "User"
    });

    await User.findByIdAndDelete(userId);

    return res.json({
      success: true,
      message: "User removed successfully"
    });
  } catch (err) {
    next(err);
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ApiError(404, "There is no user with that email"));
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire (10 mins)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset url based on origin
    const origin = req.headers.origin || (user.role === 'admin' ? "http://localhost:5174" : "http://localhost:5173");
    const resetUrl = `${origin}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password: \n\n ${resetUrl}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #10b981;">TuneStream Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Please click the button below to set a new password. This link is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 10px;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #999; font-size: 10px;">${resetUrl}</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "TuneStream Password Reset",
        message,
        html
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ApiError(500, "Email could not be sent"));
    }
  } catch (err) {
    next(err);
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return next(new ApiError(400, "Invalid token"));
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    sendAccessToken(res, accessToken);
    sendRefreshToken(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
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

// ================= OTP LOGIC =================
export const sendOTP = async (req, res, next) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return next(new ApiError(400, "Email or Phone Number is required"));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    if (email) {
      await sendEmail({
        email,
        subject: "TuneStream OTP Verification",
        message: `Your verification code is: ${otp}. It expires in 5 minutes.`,
        html: `<div style="font-family: sans-serif; text-align: center;"><h2>Verify your account</h2><p>Your OTP is:</p><h1 style="color: #10b981; letter-spacing: 5px;">${otp}</h1><p>Expires in 5 minutes.</p></div>`
      });
    }

    if (phoneNumber) {
      console.log(`\n--- [DEVELOPMENT] MOCK SMS ---`);
      console.log(`To: ${phoneNumber}`);
      console.log(`OTP: ${otp}`);
      console.log(`------------------------------\n`);
    }

    // Temporary storage for verification
    // In a real app, you'd save this to a pre-registration collection or session
    // For now, we'll return success and the frontend will send it back for verification
    // OR we save it to the user if they exist
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save({ validateBeforeSave: false });
    }

    res.json({ success: true, message: "OTP sent successfully", devOtp: (process.env.NODE_ENV !== 'production' ? otp : undefined) });
  } catch (err) {
    next(err);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, phoneNumber, otp } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ApiError(400, "Invalid or expired OTP"));
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    next(err);
  }
};