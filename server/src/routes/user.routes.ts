import express from "express";
import {
  countAdmins,
  countUsers,
  deleteOtherUser,
  deleteSelf,
  forgotPass,
  login,
  profile,
  resetPass,
  showAll,
  showAllAdmins,
  showAllCustomers,
  showOne,
  signup,
  signupAdmin,
  toAdmin,
  updateOtherAdmin,
  updateOtherUser,
  updateSelf,
} from "../controllers/user.controller";
import { checkAuth } from "../middlewares/auth";
import { isAdminOrSuperAdmin, isSuperAdmin } from "../middlewares/roles";
import { verifyForgetToken } from "../middlewares/forget";
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
userRouter.post("/signup-admin", checkAuth, isSuperAdmin, signupAdmin);

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
 * /api/user/forgot-pass:
 *  post:
 *    summary: Forget Password
 *    security:
 *      bearerAuth: []
 *    description: Generated a link with reset password token and mails it
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Mail sent successfully
 *      406:
 *        description: User not found
 *      500:
 *        description: Some error occurred
 */
userRouter.post("/forgot-pass", forgotPass);
/**
 * @openapi
 * /api/user/reset:
 *  post:
 *    summary: Reset Password
 *    description: Reset Password if the token is valid
 *    parameters:
 *      name: token
 *      in: header
 *      description: Token aur verifying
 *      required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                required: true
 *              confirmPassword:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Password reset successfully
 *      406:
 *        description: Token invalid
 *      500:
 *        description: Some error occurred
 */

userRouter.post("/reset", verifyForgetToken, resetPass);

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
 * /api/user/all-admins:
 *  get:
 *    summary: Get all admins
 *    description: Get all admins
 *    security:
 *      bearerAuth: []
 *    responses:
 *      200:
 *        description: All admins retrieved successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Some error occurred
 */

userRouter.get("/all-admins", checkAuth, isSuperAdmin, showAllAdmins);

/**
 * @openapi
 * /api/user/all-users:
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

userRouter.get(
  "/all-customers",
  checkAuth,
  isAdminOrSuperAdmin,
  showAllCustomers
);

/**
 * @openapi
 * /api/user/count-customers:
 *  get:
 *    summary: Count all customers
 *    description: Count all customers
 *    security:
 *      bearerAuth: []
 *    responses:
 *      200:
 *        description: All customers counted successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Some error occurred
 */

userRouter.get("/count-users", checkAuth, isAdminOrSuperAdmin, countUsers);

/**
 * @openapi
 * /api/user/count-admins:
 *  get:
 *    summary: Count all admins
 *    description: Count all admins
 *    security:
 *      bearerAuth: []
 *    responses:
 *      200:
 *        description: All admins counted successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Some error occurred
 */

userRouter.get("/count-admins", checkAuth, isSuperAdmin, countAdmins);

/**
 * @openapi
 * /api/user/to-admin:
 *  put:
 *    summary: Make user admin
 *    description: Make user admin
 *    security:
 *      bearerAuth: []
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

userRouter.put("/to-admin", checkAuth, isSuperAdmin, toAdmin);
userRouter.put("/update-admin/:id", checkAuth, isSuperAdmin, updateOtherAdmin);

/**
 * @openapi
 * /api/user/{_id}:
 *  get:
 *    summary: Display a user by ID
 *    description: Display a user by ID
 *    parameters:
 *      - in: path
 *        name: _id
 *        required: true
 *        description: ID of the user to display
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: user fetched successfully
 *      404:
 *        description: user not found
 *      500:
 *        description: Some error occurred
 */
userRouter.get("/:_id", checkAuth, isSuperAdmin, showOne);

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
userRouter.delete("/:id", checkAuth, isAdminOrSuperAdmin, deleteOtherUser);

export default userRouter;
