import mongoose, { InferSchemaType } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  name: String,
  detail: String,
  price: String,
  hero: String,
  image: String,
});

productSchema.plugin(paginate);

type Product = InferSchemaType<typeof productSchema>;
const Product = mongoose.model<Product, mongoose.PaginateModel<Product>>(
  "Product",
  productSchema,
  "products"
);
export default Product;
