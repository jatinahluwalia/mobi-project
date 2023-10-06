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
import { checkPermission } from "../middlewares/permissions";

const productRouter = express.Router();

/**
 * @openapi
 * tags:
 *   name: Products
 *   description: API for managing products
 */

//public routes

/**
 * @openapi
 * /api/product:
 *  get:
 *    summary: Display all products
 *    description: Display all products
 *    responses:
 *      200:
 *        description: Products fetched successfully
 *      500:
 *        description: Some error occurred
 */
productRouter.get("/", checkAuth, checkPermission("product-view"), displayAll);

/**
 * @openapi
 * /api/product/{_id}:
 *  get:
 *    summary: Display a product by ID
 *    description: Display a product by ID
 *    parameters:
 *      - in: path
 *        name: _id
 *        required: true
 *        description: ID of the product to display
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Product fetched successfully
 *      404:
 *        description: Product not found
 *      500:
 *        description: Some error occurred
 */
productRouter.get(
  "/:_id",
  checkAuth,
  checkPermission("product-view"),
  displayOne
);

//admin routes

/**
 * @openapi
 * /api/product:
 *  post:
 *    summary: Add a new product
 *    description: Add a new product
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              detail:
 *                type: string
 *              hero:
 *                type: string
 *              price:
 *                type: string
 *              image:
 *                type: string
 *    responses:
 *      201:
 *        description: Product added successfully
 *      400:
 *        description: Invalid request body
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Some error occurred
 */
productRouter.post("/", checkAuth, checkPermission("product-add"), addProduct);

/**
 * @openapi
 * /api/product/{_id}:
 *  put:
 *    summary: Update a product by ID
 *    description: Update a product by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: _id
 *        required: true
 *        description: ID of the product to update
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              detail:
 *                type: string
 *              hero:
 *                type: string
 *              price:
 *                type: string
 *              image:
 *                type: string
 *    responses:
 *      200:
 *        description: Product updated successfully
 *      400:
 *        description: Invalid request body
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Product not found
 *      500:
 *        description: Some error occurred
 */
productRouter.put(
  "/:_id",
  checkAuth,
  checkPermission("product-edit"),
  updateProduct
);

//superadmin routes

/**
 * @openapi
 * /api/product/{_id}:
 *  delete:
 *    summary: Delete a product by ID
 *    description: Delete a product by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: _id
 *        required: true
 *        description: ID of the product to delete
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Product deleted successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Product not found
 *      500:
 *        description: Some error occurred
 */
productRouter.delete(
  "/:_id",
  checkAuth,
  checkPermission("product-delete"),
  deleteProduct
);

export default productRouter;
