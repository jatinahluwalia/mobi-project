import { LinearProgress, Typography } from "@mui/material";
import UpdateProductForm from "../../components/form/UpdateProductForm";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { routingVariants } from "../../utils/animation";
import { motion } from "framer-motion";

const UpdateProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { _id } = useParams();

  const getProduct = useCallback(async () => {
    const res = await axios.get("/api/product/" + _id);
    const data = res.data;
    setProduct(data.product);
  }, [_id]);

  const getUser = useCallback(async () => {
    const res = await axios.get("/api/user");
    const data = res.data;
    setUser(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full">
        <LinearProgress />
      </div>
    );

  if (user && !user.permissions.includes("product-edit"))
    return (
      <motion.section {...routingVariants} className="p-5 grow">
        <Typography variant="h2" marginY={5}>
          Update Product
        </Typography>
        <Typography variant="h6" marginBottom={5}>
          You are not authorized to view this page.
        </Typography>
      </motion.section>
    );
  return (
    product && (
      <div className="flex flex-col p-5 w-full">
        <Typography variant="h2" marginBottom={5} component={"span"}>
          Update Product:{" "}
          <Typography variant="h2" component={"span"} color="primary">
            {product.name}
          </Typography>
        </Typography>
        <UpdateProductForm
          _id={String(_id)}
          detail={product.detail}
          name={product.name}
          price={product.price}
          hero={product.hero}
        />
      </div>
    )
  );
};

export default UpdateProduct;
