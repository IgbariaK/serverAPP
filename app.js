
const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");

// Ensure DB schema created
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const favRoutes = require("./routes/favoriteRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  store: new SQLiteStore({ db: "sessions.sqlite" }),
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => res.render("home", { user: req.session.user }));

app.use("/", authRoutes);
app.use("/", favRoutes);
app.use("/", searchRoutes);

app.listen(3000, () => console.log("http://localhost:3000"));
