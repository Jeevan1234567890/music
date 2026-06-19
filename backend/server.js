const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

if (process.env.MONGO_URI) {
  connectDB().catch((err) => {
    console.log("MongoDB connection failed, using local file storage fallback.");
  });
} else {
  console.log("MONGO_URI not specified. Favorites will use local JSON storage.");
}

app.use(cors());

app.use(express.json());

app.use(
  "/api/songs",
  require("./routes/songRoutes")
);

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});