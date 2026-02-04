
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite");

// Create tables
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
