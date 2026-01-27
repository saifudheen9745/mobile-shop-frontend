import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./auth/auth.route.js";
import categoryRouter from "./categories/categories.routes.js";
import productRouter from "./products/product.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/categories", categoryRouter)
app.use("/products", productRouter)

app.get("/", (req, res) => {
  res.send("Backend ESM + TS working!");
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(
  PORT,
  () => console.log(`Server running on ${PORT}`),
);
