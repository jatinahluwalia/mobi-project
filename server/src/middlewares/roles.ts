import { NextFunction, Request, Response } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    if (req.user.role !== "Admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Please authenticate" });
  }
};

export const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    if (req.user.role !== "Super Admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Please authenticate" });
  }
};

export const isAdminOrSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    if (req.user.role === "Admin" || req.user.role === "Super Admin") {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Please authenticate" });
  }
};
