const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
// MongoDB Database Connection
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskmaster")
  .then(() => {
    console.log("Connected to MongoDB database!");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to the Task Management System!");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
