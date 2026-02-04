
const bcrypt = require("bcrypt");
const UserRepo = require("../repositories/UserRepository");

module.exports = {
  async register({ fullName, email, password }) {
    const existing = await UserRepo.findByEmail(email);
    if (existing) {
      return { ok: false, reason: "EMAIL_EXISTS" };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserRepo.create({ fullName, email, passwordHash });
    return { ok: true, user };
  },

  async login({ email, password }) {
    const userRow = await UserRepo.findByEmail(email);
    if (!userRow) return { ok: false, reason: "USER_NOT_FOUND" };

    const ok = await bcrypt.compare(password, userRow.passwordHash);
    if (!ok) return { ok: false, reason: "WRONG_PASSWORD" };

    // Keep only safe fields in session
    const user = { id: userRow.id, fullName: userRow.fullName, email: userRow.email };
    return { ok: true, user };
  }
};
