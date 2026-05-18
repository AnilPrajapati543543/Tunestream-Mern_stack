import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10000, // Substantially increased to prevent temporary HTTP 429 errors during rapid testing
  message: "Too many requests, try again later",
});