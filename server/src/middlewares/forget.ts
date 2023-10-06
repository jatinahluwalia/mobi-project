import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyForgetToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = jwt.verify(
      String(req.headers.token),
      String(process.env.JWT_SECRET)
    ) as any;
    //@ts-ignore
    req.email = email;
    return next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error" });
  }
};
