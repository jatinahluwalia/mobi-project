import express from "express";
import {
  deleteOtherUser,
  deleteSelf,
  login,
  profile,
  showAll,
  signup,
  signupAdmin,
  signupSuperAdmin,
  updateOtherUser,
  updateSelf,
} from "../controllers/user.controller";
import { checkAuth } from "../middlewares/auth";
import {
  isAdmin,
  isAdminOrSuperAdmin,
  isSuperAdmin,
} from "../middlewares/roles";

const userRouter = express.Router();

//Auth routes

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/signup-admin", checkAuth, isAdminOrSuperAdmin, signupAdmin);
userRouter.post(
  "/signup-super-admin",
  checkAuth,
  isSuperAdmin,
  signupSuperAdmin
);

//User specific routes

userRouter.get("/", checkAuth, profile);
userRouter.put("/", checkAuth, updateSelf);
userRouter.delete("/", checkAuth, deleteSelf);

//Admin specific routes

userRouter.get("/all", checkAuth, isSuperAdmin, showAll);
userRouter.put("/:id", checkAuth, isAdminOrSuperAdmin, updateOtherUser);
userRouter.delete("/:id", checkAuth, isAdmin, deleteOtherUser);

export default userRouter;
