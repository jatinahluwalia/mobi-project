import express from "express";
import cors from "cors";
import connectToDB from "./config/db";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/routes";
import morgan from "morgan";
import swaggerDocs from "./utils/swagger";

const app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use("/api", router);
swaggerDocs(app);

app.get("/", (_req, res) => {
  return res.send("Everything working correctly");
});

connectToDB(app);
