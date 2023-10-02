import { NextFunction, Request, Response } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    if (req.user.role !== "admin") {
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
    if (req.user.role !== "superadmin") {
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
    if (req.user.role !== "admin" || req.user.role !== "superadmin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Please authenticate" });
  }
};
