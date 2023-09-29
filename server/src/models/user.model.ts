import { Signup } from "./../types/signup";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function ({
  fullName,
  email,
  password,
  phone,
}: Signup) {
  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  }
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw new Error("Email already exists.");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
  if (!validator.isMobilePhone(phone)) {
    throw new Error("Please enter valid mobile number");
  }
  if (!validator.isAlpha(fullName)) {
    throw new Error("Please enter valid name");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await this.create({
    fullName,
    email,
    hashedPassword,
    phone,
  });
  return { message: "Signed up successfully" };
};

userSchema.statics.login = async function (email: string, password: string) {
  if (!email) {
    throw new Error("Email field cannot be empty");
  }
  if (!password) {
    throw new Error("Password field cannot be empty");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User does not exist");
  }
  const { hashedPassword, _id } = user["_doc"];
  const matched = await bcrypt.compare(password, hashedPassword);
  if (!matched) {
    throw new Error("Incorrect password.");
  }
  const token = jwt.sign(
    { _id: _id.toString() },
    process.env.JWT_SECRET || "uirbvvubvuebuebu",
    {
      expiresIn: "1d",
    }
  );

  return { _id, token };
};

const User = mongoose.model("User", userSchema);

export default User;
