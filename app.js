const fs = require("fs");
const path = require("path");
const express = require("express");
const session = require("express-session");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const favRoutes = require("./routes/favoriteRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

//  Render/Reverse-proxy support (important for secure cookies on Render HTTPS)
app.set("trust proxy", 1);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =============================
//  SESSION SETUP (Render-friendly)
// Uses MemoryStore (no connect-sqlite3 needed)
// =============================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      // Render is HTTPS in production; secure cookies should be enabled
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// =============================
//  ENV VARS (available everywhere)
// =============================
app.locals.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

// Optional: warn in logs if missing (won't crash the server)
if (!app.locals.YOUTUBE_API_KEY) {
  console.warn(
    "[WARN] YOUTUBE_API_KEY is not set. Search/YouTube features may not work."
  );
}

// Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home
app.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

// Routes
app.use("/", authRoutes);
app.use("/", favRoutes);
app.use("/", searchRoutes);

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
