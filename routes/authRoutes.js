
const r = require("express").Router();
const c = require("../controllers/AuthController");

r.get("/login", c.showLogin);
r.get("/register", c.showRegister);

r.post("/login", c.login);
r.post("/register", c.register);

r.get("/logout", c.logout);

module.exports = r;
