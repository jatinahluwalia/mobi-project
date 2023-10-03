import { isAdminOrSuperAdmin, isSuperAdmin } from "./../middlewares/roles";
import express from "express";
import {
  addProduct,
  deleteProduct,
  displayAll,
  displayOne,
  updateProduct,
} from "../controllers/product.controller";
import { checkAuth } from "../middlewares/auth";

const productRouter = express.Router();

//public routes

productRouter.get("/", displayAll);
productRouter.get("/:_id", displayOne);

//admin routes

productRouter.post("/", checkAuth, isAdminOrSuperAdmin, addProduct);
productRouter.put("/:_id", checkAuth, isAdminOrSuperAdmin, updateProduct);

//superadmin routes

productRouter.delete("/:_id", checkAuth, isSuperAdmin, deleteProduct);

export default productRouter;
