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
    const decoded = jwt.verify(String(token), String(process.env.JWT_SECRET));
    const user = await User.findById(decoded);
    if (!user) {
      throw new Error();
    }
    //@ts-ignore
    req.user = {
      _id: user._id,
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Please authenticate" });
  }
};

export const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      if (req.user.role !== role) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Please authenticate" });
    }
  };
};
