import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jatin.ahluwalia@indicchain.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});
