import { Request, Response } from "express";
import Product from "../models/products.model";

export const displayAll = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const products = await Product.paginate(
      {},
      {
        page,
        limit,
      }
    );
    return res.status(200).json({ products });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const displayOne = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const product = await Product.findById(_id);
    return res.status(200).json({ product });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    await Product.create(req.body);
    return res.status(200).json({ message: "Product created successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    await Product.findByIdAndUpdate(_id, req.body);
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    await Product.findByIdAndDelete(_id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
