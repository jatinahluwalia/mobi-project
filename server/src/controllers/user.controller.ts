import User from "../models/user.model";
import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone } = req.body;
    if (!validator.isEmail(email)) {
      return res
        .status(406)
        .json({ error: "Please enter a valid email.", field: "email" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(406)
        .json({ error: "User already exists.", field: "email" });
    }
    if (!validator.isStrongPassword(password)) {
      res
        .status(406)
        .json({ error: "Enter a strong password.", field: "password" });
    }
    if (!validator.isMobilePhone(phone)) {
      return res
        .status(406)
        .json({ error: "Enter a vaid mobile number.", field: "phone" });
    }
    if (!validator.isAlpha(fullName)) {
      return res
        .status(406)
        .json({ error: "Enter a valid Name", field: "Name" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fullName,
      email,
      hashedPassword,
      phone,
    });
    res.status(200).json({ message: "Signed up successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async function (req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(406)
        .json({ error: "Please enter email", field: "email" });
    }
    if (!password) {
      return res
        .status(406)
        .json({ error: "Password field cannot be empty", field: "password" });
    }

    const user = (await User.findOne({ email })) as any;
    if (!user) {
      return res
        .status(406)
        .json({ error: "User does not exist", field: "email" });
    }
    const { hashedPassword, _id } = user;
    const matched = await bcrypt.compare(password, hashedPassword);
    if (!matched) {
      return res
        .status(406)
        .json({ error: "Incorrect password.", field: "password" });
    }
    const token = jwt.sign(
      { _id: _id.toString() },
      process.env.JWT_SECRET || "uirbvvubvuebuebu",
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({ _id, token });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
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
