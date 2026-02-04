const fs = require("fs");
const path = require("path");
const os = require("os");
const sqlite3 = require("sqlite3").verbose();

// ✅ Use env var if provided, otherwise default to /tmp on Render
const DB_FILE =
  process.env.DB_FILE ||
  path.join(os.tmpdir(), "database.sqlite");

// ✅ Ensure directory exists
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

console.log("✅ Using SQLite DB file:", DB_FILE);

// ✅ Open DB (create if missing)
const db = new sqlite3.Database(
  DB_FILE,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("❌ SQLite open error:", err.message);
    } else {
      console.log("✅ SQLite opened successfully");
    }
  }
);

// ✅ Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS favorites(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    videoId TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
