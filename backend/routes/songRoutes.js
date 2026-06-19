const router = require("express").Router();

const {
  getSongs,
  searchSongs,
  getMoodSongs,
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/songController");

router.get("/", getSongs);
router.get("/search", searchSongs);
router.get("/mood/:mood", getMoodSongs);

// Favorites endpoints
router.get("/favorites", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites/:trackId", removeFavorite);

module.exports = router;