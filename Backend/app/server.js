import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
app.use(express.json());

// Connect DB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Backend hệ thống quản lý phim đang chạy...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
