import { CurrencyRupee } from "@mui/icons-material";
import { LinearProgress, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Product = () => {
  const { _id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const getUser = useCallback(async () => {
    const res = await axios.get(`/api/user`);
    const data = res.data;
    setUser(data);
    setLoading(false);
  }, []);

  const getProduct = useCallback(async () => {
    const res = await axios.get(`/api/product/${_id}`);
    const data = res.data;
    setProduct(data.product);
  }, [_id]);

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
  if (user && !user.permissions.includes("product-view"))
    return (
      <Typography variant="h3" padding={5}>
        You are not authorized to view this page
      </Typography>
    );

  return (
    <Stack padding={5}>
      <Typography variant="h3" component="h1">
        {product?.name}
      </Typography>
      <Typography variant="body1" component="p" color={"text.secondary"}>
        {product?.detail}
      </Typography>
      <Stack direction={"row"} gap={1} alignItems={"center"} marginTop={3}>
        <CurrencyRupee />
        <Typography variant="body1" component="p">
          {product?.price}
        </Typography>
      </Stack>
      <Typography variant="body1" component="p" marginTop={1}>
        {product?.hero}
      </Typography>
    </Stack>
  );
};

export default Product;
