const songs = require("../data/songs.json");
const Song = require("../models/Song");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const FAVORITES_FILE = path.join(__dirname, "../data/favorites.json");

// Local file helper functions
const getFavoritesFromFile = () => {
  if (!fs.existsSync(FAVORITES_FILE)) {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(FAVORITES_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveFavoritesToFile = (favs) => {
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favs, null, 2));
};

exports.getSongs = (req, res) => {
  res.json(songs);
};

// Query iTunes search API for live, rich music tracks matching the UI needs
exports.searchSongs = async (req, res) => {
  const q = req.query.q || "";
  try {
    const response = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=30`,
      { timeout: 5000 }
    );
    res.json(response.data.results);
  } catch (error) {
    console.error("iTunes API error:", error.message);
    // Fallback to local songs.json filtering
    const filtered = songs.filter(
      (song) =>
        song.name.toLowerCase().includes(q.toLowerCase()) ||
        song.artist.toLowerCase().includes(q.toLowerCase())
    );
    // Map local format to match expected iTunes properties
    const mapped = filtered.map((s) => ({
      trackId: s.id,
      trackName: s.name,
      artistName: s.artist,
      artworkUrl100: s.image_url,
      previewUrl: "",
    }));
    res.json(mapped);
  }
};

exports.getMoodSongs = (req, res) => {
  const mood = req.params.mood;
  const result = songs.filter(
    (song) => song.mood.toLowerCase() === mood.toLowerCase()
  );
  res.json(result);
};

// Favorites implementation with MongoDB + local file fallback
exports.getFavorites = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState === 1) {
      const dbFavs = await Song.find({});
      return res.json(dbFavs);
    }
  } catch (err) {
    console.error("Mongoose read failed, falling back to local file:", err.message);
  }
  const fileFavs = getFavoritesFromFile();
  res.json(fileFavs);
};

exports.addFavorite = async (req, res) => {
  const { trackId, name, artist, imageUrl } = req.body;
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState === 1) {
      const existing = await Song.findOne({ trackId });
      if (existing) {
        return res.status(200).json(existing);
      }
      const newFav = await Song.create({ trackId, name, artist, imageUrl });
      return res.status(201).json(newFav);
    }
  } catch (err) {
    console.error("Mongoose save failed, falling back to local file:", err.message);
  }

  const fileFavs = getFavoritesFromFile();
  const existing = fileFavs.find((f) => String(f.trackId) === String(trackId));
  if (existing) {
    return res.status(200).json(existing);
  }
  const newFav = { _id: Date.now().toString(), trackId, name, artist, imageUrl };
  fileFavs.push(newFav);
  saveFavoritesToFile(fileFavs);
  res.status(201).json(newFav);
};

exports.removeFavorite = async (req, res) => {
  const { trackId } = req.params;
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState === 1) {
      await Song.findOneAndDelete({ trackId });
      return res.status(200).json({ message: "Removed successfully" });
    }
  } catch (err) {
    console.error("Mongoose delete failed, falling back to local file:", err.message);
  }

  let fileFavs = getFavoritesFromFile();
  fileFavs = fileFavs.filter((f) => String(f.trackId) !== String(trackId));
  saveFavoritesToFile(fileFavs);
  res.status(200).json({ message: "Removed successfully" });
};