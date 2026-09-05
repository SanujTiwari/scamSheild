const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const scanRoutes = require("./routes/scanRoutes");
const companyRoutes = require("./routes/companyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// ─── Security: CORS Configuration ───
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000", "https://jobshield-zeta.vercel.app"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Also allow any *.vercel.app subdomain for preview deployments
    if (/\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
}));

// ─── Security: Request Body Size Limit ───
app.use(express.json({ limit: "1mb" }));

// ─── Security: Global Rate Limiter ───
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});
app.use(globalLimiter);

// ─── Security: Stricter Rate Limit for Scan Endpoints ───
const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 scan requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Scan rate limit reached. Please wait before submitting another analysis." },
});

// ─── Security: Stricter Rate Limit for Auth Endpoints ───
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 auth attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts. Please try again later." },
});

// ─── Security: Basic Input Sanitization Middleware ───
app.use((req, res, next) => {
  // Prevent excessively large payloads from causing memory issues
  if (req.body && typeof req.body === "object") {
    const bodyStr = JSON.stringify(req.body);
    if (bodyStr.length > 500000) { // 500KB
      return res.status(413).json({ success: false, message: "Request payload too large" });
    }
  }
  next();
});

// ─── Routes ───
app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/scans", scanLimiter, scanRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", scanLimiter, chatRoutes);
app.use("/api/resume", resumeRoutes);

// ─── Security: Global Error Handler ───
// Prevents internal errors from leaking to client
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again." });
});

module.exports = app;