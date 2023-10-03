import UpdateProductForm from "../../components/form/UpdateProductForm";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
  const [product, setProduct] = useState<any>(null);
  const { _id } = useParams();
  useEffect(() => {
    const getProduct = async () => {
      const res = await axios.get("/api/product/" + _id);
      const data = res.data;
      setProduct(data.product);
    };
    getProduct();
  }, []);
  return (
    product && (
      <UpdateProductForm
        _id={String(_id)}
        detail={product?.detail}
        name={product?.name}
        price={product?.price}
      />
    )
  );
};

export default UpdateProduct;
