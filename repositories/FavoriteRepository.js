const db = require("../config/db");

module.exports = {
  getAllByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM favorites WHERE user_id = ? ORDER BY id DESC",
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  },

  add(userId, title, videoId) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO favorites (user_id, title, videoId) VALUES (?, ?, ?)",
        [userId, title, videoId],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, user_id: userId, title, videoId });
        }
      );
    });
  },

  remove(id, userId) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM favorites WHERE id = ? AND user_id = ?",
        [id, userId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }
};
