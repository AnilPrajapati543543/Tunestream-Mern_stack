import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dns from "dns";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";

import userRoutes from "./src/routes/userRoutes.js";
import songRouter from "./src/routes/songRoute.js";
import albumRouter from "./src/routes/albumRoute.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";

// ================= CONFIG =================
dotenv.config();

// DNS Fix (optional)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const port = process.env.PORT || 4000;

// ================= CORS (Must be before other middleware) =================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "https://tunestream-mern-stack.vercel.app",
  "https://tunestream-mern-stack-admin.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
  "http://127.0.0.1:3000"
].filter(Boolean); // Remove any undefined/null values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(o => origin === o || (typeof o === 'string' && origin.startsWith(o)));
      const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");

      if (isAllowed || isLocal) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// ================= DB CONNECTION =================
connectDB();
connectCloudinary();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ================= DEBUG (DEV ONLY) =================
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url, "Origin:", req.headers.origin);
    next();
  });
}

// ================= ROUTES =================
app.get("/", (req, res) => res.send("API Working"));

// Keep-Alive Ping Route
app.get("/ping", (req, res) => res.status(200).send("I'm awake!"));

// Auth routes
app.use("/api/user", userRoutes);

// Other routes
app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ================= ERROR HANDLER =================
app.use(errorMiddleware);

// ================= START SERVER =================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});