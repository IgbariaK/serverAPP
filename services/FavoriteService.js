
const FavRepo = require("../repositories/FavoriteRepository");

module.exports = {
  list(userId) {
    return FavRepo.getAllByUserId(userId);
  },
  add(userId, title, videoId) {
    return FavRepo.add(userId, title, videoId);
  },
  remove(id, userId) {
    return FavRepo.remove(id, userId);
  }
};
