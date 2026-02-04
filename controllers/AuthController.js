
const AuthService = require("../services/AuthService");

module.exports = {
  showLogin(req, res) {
    res.render("login", { error: null, email: "" });
  },

  showRegister(req, res) {
    res.render("register", { error: null, fullName: "", email: "" });
  },

  async register(req, res) {
    const fullName = (req.body.fullName || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!fullName || !email || !password) {
      return res.render("register", { error: "All fields are required.", fullName, email });
    }

    try {
      const result = await AuthService.register({ fullName, email, password });
      if (!result.ok && result.reason === "EMAIL_EXISTS") {
        return res.render("register", { error: "Email already registered. Try login.", fullName, email });
      }
      return res.redirect("/login?registered=1");
    } catch (e) {
      console.error(e);
      return res.render("register", { error: "Something went wrong. Try again.", fullName, email });
    }
  },

  async login(req, res) {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      return res.render("login", { error: "Email and password are required.", email });
    }

    try {
      const result = await AuthService.login({ email, password });

      if (!result.ok) {
        if (result.reason === "USER_NOT_FOUND") {
          return res.render("login", { error: "User not found. Please register.", email });
        }
        if (result.reason === "WRONG_PASSWORD") {
          return res.render("login", { error: "Wrong password.", email });
        }
        return res.render("login", { error: "Login failed.", email });
      }

      req.session.user = result.user;
      return res.redirect("/");
    } catch (e) {
      console.error(e);
      return res.render("login", { error: "Something went wrong. Try again.", email });
    }
  },

  logout(req, res) {
    req.session.destroy(() => res.redirect("/"));
  }
};
