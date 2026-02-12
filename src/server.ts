import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./auth/auth.route.js";
import categoryRouter from "./categories/categories.routes.js";
import productRouter from "./products/product.routes.js";
import purchaseRouter from "./purchase/purchase.routes.js"
import dashboardRouter from "./dashboard/dashboard.routes.js";
import expenseRouter from "./expense/expense.routes.js"
import employeeRouter from "./employee/employee.routes.js"
import vendorRouter from "./vendor/vendor.routes.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/auth", authRouter);
app.use("/categories", categoryRouter)
app.use("/products", productRouter)
app.use("/purchase", purchaseRouter)
app.use("/dashboard", dashboardRouter);
app.use("/vendors", vendorRouter);
app.use("/employees", employeeRouter);
app.use("/expenses", expenseRouter);


app.get("/", (req, res) => {
  res.send("Backend ESM + TS working!");
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(
  PORT,
  () => console.log(`Server running on ${PORT}`),
);
