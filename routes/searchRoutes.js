
const r = require("express").Router();
const c = require("../controllers/SearchController");

r.get("/search", c.search);

module.exports = r;
