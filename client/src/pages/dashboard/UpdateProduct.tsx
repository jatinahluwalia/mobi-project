import { Stack, Typography } from "@mui/material";
import UpdateProductForm from "../../components/form/UpdateProductForm";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { _id } = useParams();
  useEffect(() => {
    const getProduct = async () => {
      const res = await axios.get("/api/product/" + _id);
      const data = res.data;
      setProduct(data.product);
    };
    getProduct();
  }, [_id]);
  return (
    product && (
      <Stack padding={5} width={"100%"}>
        <Typography variant="h2" marginBottom={5} component={"span"}>
          Update Product:{" "}
          <Typography variant="h2" component={"span"} color="primary">
            {product?.name}
          </Typography>
        </Typography>
        <UpdateProductForm
          _id={String(_id)}
          detail={product?.detail}
          name={product?.name}
          price={product?.price}
        />
      </Stack>
    )
  );
};

export default UpdateProduct;
