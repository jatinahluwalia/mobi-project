import userRouter from "./user.routes";
import productRouter from "./product.routes";
import express from "express";

const router = express.Router();

//user routes

router.use("/user", userRouter);

//product routes

router.use("/product", productRouter);

router.post("/shiprocket", (_req, res) => {
  return res.status(200).json("Hello");
});

export default router;
