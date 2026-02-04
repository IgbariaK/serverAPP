
const axios = require("axios");

module.exports = {
  async search(req, res) {
    const q = (req.query.q || "").trim();
    if (!q) return res.render("search", { results: [], q: "" });

    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    const html = (await axios.get(url)).data;

    const results = [];
    const regex = /"videoId":"(.*?)".*?"title":\{"runs":\[\{"text":"(.*?)"/g;

    let m;
    while ((m = regex.exec(html)) !== null) {
      results.push({
        videoId: m[1],
        title: m[2],
        thumbnail: `https://img.youtube.com/vi/${m[1]}/0.jpg`,
      });
      if (results.length >= 12) break;
    }

    res.render("search", { results, q });
  }
};
