import express from "express";
import cors from "cors";
import connectToDB from "./config/db";
import dotenv from "dotenv";
import router from "./routes/routes";
import morgan from "morgan";

dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/api", router);

app.get("/", (_req, res) => {
  return res.send("Everything working correctly");
});

connectToDB(app);
