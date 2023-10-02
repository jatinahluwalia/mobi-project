import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { _id } = jwt.verify(
      String(token),
      String(process.env.JWT_SECRET)
    ) as any;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    //@ts-ignore
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Please authenticate" });
  }
};
