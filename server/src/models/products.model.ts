import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  detail: String,
  price: String,
  hero: String,
  image: String,
});

const Product = mongoose.model("products", productSchema);
export default Product;
