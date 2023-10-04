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

/**
 * @openapi
 * /api/user/login:
 *  post:
 *    summary: Login user
 *    description: Login user
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: User logged in successfully
 *      400:
 *        description: Invalid credentials
 *      500:
 *        description: Some error occurred
 */
userRouter.post("/login", login);

/**
 * @openapi
 * /api/user/signup:
 *  post:
 *    summary: Signup user
 *    description: Signup user
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *              phone:
 *                type: string
 *                required: true
 *              fullName:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: User signed up successfully
 *      406:
 *        description: Invalid credentials
 *      500:
 *        description: Some error occurred
 */
userRouter.post("/signup", signup);

/**
 * @openapi
 * /api/user/signup-admin:
 *  post:
 *    summary: Signup admin
 *    security:
 *      bearerAuth: []
 *    description: Signup admin
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *              phone:
 *                type: string
 *                required: true
 *              fullName:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Admin signed up successfully
 *      406:
 *        description: Invalid credentials
 *      500:
 *        description: Some error occurred
 */
userRouter.post("/signup-admin", checkAuth, isAdminOrSuperAdmin, signupAdmin);

/**
 * @openapi
 * /api/user/signup-super-admin:
 *  post:
 *    summary: Signup super admin
 *    security:
 *      bearerAuth: []
 *    description: Signup super admin
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *              phone:
 *                type: string
 *                required: true
 *              fullName:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Super admin signed up successfully
 *      406:
 *        description: Invalid credentials
 *      500:
 *        description: Some error occurred
 */
userRouter.post(
  "/signup-super-admin",
  checkAuth,
  isSuperAdmin,
  signupSuperAdmin
);

/**
 * @openapi
 * /api/user:
 *  get:
 *    summary: Get user profile
 *    description: Get user profile
 *    security:
 *      bearerAuth: []
 *    responses:
 *      200:
 *        description: User profile retrieved successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Some error occurred
 */
userRouter.get("/", checkAuth, profile);

/**
 * @openapi
 * /api/user:
 *  put:
 *    summary: Update user profile
 *    description: Update user profile
 *    security:
 *      bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              phone:
 *                type: string
 *              fullName:
 *                type: string
 *    responses:
 *      200:
 *        description: User profile updated successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Some error occurred
 */
userRouter.put("/", checkAuth, updateSelf);

/**
 * @openapi
 * /api/user:
 *  delete:
 *    summary: Delete user profile
 *    description: Delete user profile
 *    security:
 *      bearerAuth: []
 *    responses:
 *      200:
 *        description: User profile deleted successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Some error occurred
 */
userRouter.delete("/", checkAuth, deleteSelf);

/**
 * @openapi
 * /api/user/all:
 *  get:
 *    summary: Get all users
 *    description: Get all users
 *    security:
 *      bearerAuth: []
 *    responses:
 *      200:
 *        description: All users retrieved successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Some error occurred
 */
userRouter.get("/all", checkAuth, isSuperAdmin, showAll);

/**
 * @openapi
 * /api/user/{id}:
 *  put:
 *    summary: Update other user
 *    description: Update other user
 *    security:
 *      bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: User ID
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              phone:
 *                type: string
 *              fullName:
 *                type: string
 *    responses:
 *      200:
 *        description: User updated successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Some error occurred
 */
userRouter.put("/:id", checkAuth, isAdminOrSuperAdmin, updateOtherUser);

/**
 * @openapi
 * /api/user/{id}:
 *  delete:
 *    summary: Delete other user
 *    description: Delete other user
 *    security:
 *      bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: User ID
 *    responses:
 *      200:
 *        description: User deleted successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Some error occurred
 */
userRouter.delete("/:id", checkAuth, isAdmin, deleteOtherUser);

// //User specific routes

// userRouter.get("/", checkAuth, profile);
// userRouter.put("/", checkAuth, updateSelf);
// userRouter.delete("/", checkAuth, deleteSelf);

// //Admin specific routes

// userRouter.get("/all", checkAuth, isSuperAdmin, showAll);
// userRouter.put("/:id", checkAuth, isAdminOrSuperAdmin, updateOtherUser);
// userRouter.delete("/:id", checkAuth, isAdmin, deleteOtherUser);

export default userRouter;
