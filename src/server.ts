import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend ESM + TS working!");
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(
  PORT,
  () => console.log(`Server running on ${PORT}`),
);
