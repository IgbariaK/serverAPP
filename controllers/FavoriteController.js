
const FavoriteService = require("../services/FavoriteService");

module.exports = {
  async list(req, res) {
    if (!req.session.user) return res.redirect("/login");
    const favs = await FavoriteService.list(req.session.user.id);
    res.render("favorites", { favs, user: req.session.user });
  },

  async add(req, res) {
    if (!req.session.user) return res.redirect("/login");
    const title = (req.body.title || "").trim();
    const videoId = (req.body.videoId || "").trim();

    if (!title || !videoId) return res.redirect("/search");
    await FavoriteService.add(req.session.user.id, title, videoId);
    res.redirect("/favorites");
  },

  async remove(req, res) {
    if (!req.session.user) return res.redirect("/login");
    await FavoriteService.remove(req.params.id, req.session.user.id);
    res.redirect("/favorites");
  }
};
