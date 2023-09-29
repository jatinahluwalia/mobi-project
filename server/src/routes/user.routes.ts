import express from "express";
import { login, profile, signup, update } from "../controllers/user.controller";
import { checkAuth } from "../middlewares/auth";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.put("/update", checkAuth, update);
userRouter.get("/profile", checkAuth, profile);

export default userRouter;
