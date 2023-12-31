import mongoose from "mongoose";
import { Express } from "express";

const PORT = process.env.PORT || 4000;

const connectToDB = async (app: Express) => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log("App listening at " + PORT);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectToDB;
