import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState<any>();
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/api/product");
      const data = res.data;
      setProducts(data.products);
    };
    getData();
    const getUser = async () => {
      const res = await axios.get("/api/user");
      const data = res.data;
      setUser(data);
    };
    getUser();
  }, []);
  return (
    <section className="flex items-start flex-wrap p-2 gap-2">
      {products.map((product: any) => (
        <article
          className="bg-white shadow-md rounded-md border border-black  flex flex-col gap-2 divide-y divide-y-black"
          key={product._id}
        >
          <div className="p-5 flex flex-col gap-2 items-center">
            <img src={product.image} className="rounded-full h-32  w-32" />
            <h2>{product.name}</h2>
            <p className="text-gray-500">{product.detail}</p>
            <p className="text-black">{product.price}</p>
          </div>
          {user?.role === "admin" ? (
            <div className="p-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-white shadow-md"
              >
                Edit
              </button>
            </div>
          ) : user?.role === "superadmin" ? (
            <div className="p-2 flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-white shadow-md hover:bg-opacity-80"
                onClick={() => {
                  navigate(`/dashboard/products/update/${product._id}`);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-white shadow-md hover:bg-opacity-80"
                onClick={async () => {
                  try {
                    await axios.delete(`/api/product/${product._id}`);
                    navigate(0);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Delete
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
};

export default Products;
