const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");

// ✅ Ensure DB schema is created
require("./config/db");

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const favRoutes = require("./routes/favoriteRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

// ✅ Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Sessions DB path (Render disk)
const SESSIONS_DB = process.env.SESSIONS_DB || "sessions.sqlite";

app.use(session({
  store: new SQLiteStore({ db: SESSIONS_DB }),
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false
}));

// ✅ View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Home
app.get("/", (req, res) => res.render("home", { user: req.session.user }));

// ✅ Routes
app.use("/", authRoutes);
app.use("/", favRoutes);
app.use("/", searchRoutes);

// ✅ Render PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
