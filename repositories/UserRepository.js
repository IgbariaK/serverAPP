
const db = require("../config/db");

module.exports = {
  findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  },

  create({ fullName, email, passwordHash }) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users(fullName, email, passwordHash) VALUES(?,?,?)",
        [fullName, email, passwordHash],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, fullName, email });
        }
      );
    });
  }
};
