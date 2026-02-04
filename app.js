const fs = require("fs");
const path = require("path");
const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

const authRoutes = require("./routes/authRoutes");
const favRoutes = require("./routes/favoriteRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

// body parsing + static
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Session setup (your block)
const SESSIONS_DB = process.env.SESSIONS_DB || "sessions.sqlite";
const SESSIONS_DIR = path.dirname(SESSIONS_DB);
const SESSIONS_FILE = path.basename(SESSIONS_DB);

fs.mkdirSync(SESSIONS_DIR, { recursive: true });

app.use(session({
  store: new SQLiteStore({ dir: SESSIONS_DIR, db: SESSIONS_FILE }),
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false
}));

// views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// home
app.get("/", (req, res) => res.render("home", { user: req.session.user }));

// routes
app.use("/", authRoutes);
app.use("/", favRoutes);
app.use("/", searchRoutes);

// listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
