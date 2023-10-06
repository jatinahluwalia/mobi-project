import { NextFunction, Request, Response } from "express";

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      if (req.user.permissions.includes(permission)) {
        return next();
      }
      return res.status(401).json({ error: "You dont have permission" });
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  };
};
