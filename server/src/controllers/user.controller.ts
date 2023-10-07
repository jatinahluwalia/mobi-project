import User from "../models/user.model";
import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../config/mail";

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

    const user: any = await User.findOne({ email });
    if (!user) {
      return res
        .status(406)
        .json({ error: "User does not exist", field: "email" });
    }
    const { hashedPassword, _id } = user._doc;
    const matched = await bcrypt.compare(password, hashedPassword);
    if (!matched) {
      return res
        .status(406)
        .json({ error: "Incorrect password.", field: "password" });
    }
    const token = jwt.sign(
      { _id: _id.toString() },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      _id,
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

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
    if (!validator.isMobilePhone(String(phone))) {
      return res
        .status(406)
        .json({ error: "Enter a vaid mobile number.", field: "phone" });
    }
    if (!/[A-Za-z ]/g.test(fullName)) {
      return res
        .status(406)
        .json({ error: "Enter a valid Name", field: "fullName" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fullName,
      email,
      hashedPassword,
      phone,
      permissions: ["product-view"],
    });
    res.status(200).json({ message: "Signed up successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const signupAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone, permissions } = req.body;
    if (!validator.isEmail(email)) {
      return res
        .status(406)
        .json({ error: "Please enter a valid email.", field: "email" });
    }
    if (!validator.isStrongPassword(password)) {
      return res
        .status(406)
        .json({ error: "Please enter a strong password.", field: "password" });
    }

    if (!validator.isMobilePhone(String(phone))) {
      return res
        .status(406)
        .json({ error: "Please enter a valid phone number.", field: "phone" });
    }
    if (!/^[A-Za-z ]+$/.test(fullName)) {
      return res
        .status(406)
        .json({ error: "Please enter a valid name.", field: "fullName" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(406)
        .json({ error: "User already exists.", field: "email" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      email,
      hashedPassword,
      fullName,
      phone,
      role: "admin",
      permissions,
    });
    transporter.sendMail({
      to: email,
      html: `<h1>Signed Up Successfully for Mobiloitte Admin Account</h1>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      `,
    });
    return res.status(200).json({ message: "Admin created successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateSelf = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await User.findByIdAndUpdate(req.user._id, req.body);
    return res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    return res.status(406).json({ error: error.message });
  }
};

export const deleteSelf = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    await User.findByIdAndDelete(req.user._id);
    return res.json({ message: "User deleted successfully" });
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

export const updateOtherUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findOneAndUpdate({ _id: id }, req.body);
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOtherUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const showAll = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const users = await User.paginate({}, { page, limit });
    return res.json({ users });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const showOne = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);
    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate({ email }, { forgot: true });
    if (!user)
      return res.status(406).json({ error: "User not found", field: "email" });
    if (req.headers.origin !== String(process.env.BASE_URL))
      return res
        .status(400)
        .json({ error: "Please use the website to generate link" });
    const token = jwt.sign({ email }, String(process.env.JWT_SECRET));
    transporter.sendMail({
      to: email,
      html: `<h1>Password reset link</h1>
        <a href="${process.env.BASE_URL}/reset?token=${token}">Click here</a>
        `,
    });
    return res.status(200).json({ message: "Mail sent" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

export const resetPass = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const { email } = req;
    const user = await User.findOne({ email });
    if (!user?.forgot)
      return res.status(406).json({ error: "Please generate link again" });
    if (req.headers.origin !== String(process.env.BASE_URL))
      return res
        .status(400)
        .json({ error: "Please use the website to reset password." });
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res
        .status(406)
        .json({ error: "Passwords doesn't match", field: "confirmPassword" });
    if (!validator.isStrongPassword(String(password)))
      return res
        .status(406)
        .json({ error: "Please enter a strong password", field: "password" });
    const sameAsOld = await bcrypt.compare(password, user?.hashedPassword);
    if (sameAsOld)
      return res.status(406).json({
        error: "Please cannot be the previous one",
        field: "password",
      });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.hashedPassword = hashedPassword;
    user.forgot = false;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const toAdmin = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    await User.findByIdAndUpdate(_id, {
      role: "admin",
      permissions: ["product-view"],
    });
    return res.status(200).json({ message: "Changed role successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

export const countUsers = async (req: Request, res: Response) => {
  try {
    const count = await User.countDocuments({ role: "user" });
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

export const countAdmins = async (req: Request, res: Response) => {
  try {
    const count = await User.countDocuments({ role: "admin" });
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
