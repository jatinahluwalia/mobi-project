import User from "../models/user.model";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await User.login(req.body.email, req.body.password);
    return res.json(user);
  } catch (error: any) {
    return res.status(406).json({ error: error.message });
  }
};
export const signup = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user = await User.signup(req.body);
    return res.json(user);
  } catch (error: any) {
    return res.status(406).json({ error: error.message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await User.findByIdAndUpdate(req.user._id, req.body);
    return res.json(user);
  } catch (error: any) {
    return res.status(406).json({ error: error.message });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await User.findById(req.user._id);
    return res.json(user);
  } catch (error: any) {
    return res.status(406).json({ error: error.message });
  }
};
