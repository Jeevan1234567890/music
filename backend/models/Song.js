const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema(
  {
    trackId: String,
    name: String,
    artist: String,
    album: String,
    imageUrl: String,
    mood: String,
    language: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Song",
  SongSchema
);