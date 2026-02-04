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
      return res.render("register", {
        error: "All fields are required.",
        fullName,
        email,
      });
    }

    try {
      const result = await AuthService.register({ fullName, email, password });

      if (!result.ok && result.reason === "EMAIL_EXISTS") {
        return res.render("register", {
          error: "Email already registered. Try login.",
          fullName,
          email,
        });
      }

      // ✅ OPTIONAL: create a fresh session after register (safe + consistent)
      req.session.regenerate((err) => {
        if (err) {
          console.error(err);
          // even if regenerate fails, redirect to login still works
          return res.redirect("/login?registered=1");
        }
        // we are NOT auto-logging-in here, just making sure the session is fresh
        return res.redirect("/login?registered=1");
      });
    } catch (e) {
      console.error(e);
      return res.render("register", {
        error: "Something went wrong. Try again.",
        fullName,
        email,
      });
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

      // ✅ IMPORTANT: regenerate session on successful login
      req.session.regenerate((err) => {
        if (err) {
          console.error(err);
          return res.render("login", { error: "Something went wrong. Try again.", email });
        }

        req.session.user = result.user;
        return res.redirect("/");
      });
    } catch (e) {
      console.error(e);
      return res.render("login", { error: "Something went wrong. Try again.", email });
    }
  },

  logout(req, res) {
    // extra safety
    req.session.user = null;

    req.session.destroy(() => {
      // ✅ remove cookie so browser doesn't reuse the old session id
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  },
};
