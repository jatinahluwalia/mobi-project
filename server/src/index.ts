import validator from "validator";
import express from "express";
import cors from "cors";
import connectToDB from "./config/db";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);

app.get("/", (_req, res) => {
  return res.send("Everything working correctly");
});

connectToDB(app);
