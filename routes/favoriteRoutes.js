
const r = require("express").Router();
const c = require("../controllers/FavoriteController");

r.get("/favorites", c.list);
r.post("/favorites/add", c.add);
r.get("/favorites/delete/:id", c.remove);

module.exports = r;
