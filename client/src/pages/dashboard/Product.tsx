import { CurrencyRupee } from "@mui/icons-material";
import { LinearProgress, Typography } from "@mui/material";
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
    <div className="p-5">
      <div className="flex gap-5 items-center mb-3">
        <Typography variant="h3" component="h1">
          {product?.name}
        </Typography>
        <div className="flex gap-1 items-center p-2 rounded-md border border-blue-700 text-blue-700 bg-blue-50">
          <CurrencyRupee />
          <Typography variant="body1" component="p">
            {product?.price}
          </Typography>
        </div>
        <div className="bg-purple-50 w-max p-2 border border-purple-700 text-purple-700 rounded-md h-max">
          <Typography variant="body1" component="p">
            {product?.hero}
          </Typography>
        </div>
      </div>
      <div className="bg-white p-5 rounded-md">
        <Typography variant="body1" component="p">
          {product?.detail}
        </Typography>
      </div>
    </div>
  );
};

export default Product;
