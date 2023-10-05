import { Box, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routingVariants } from "../../utils/animation";

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    axios.get("/api/product").then((res) => {
      setProducts(res.data.products);
    });

    axios.get("/api/user/all").then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <motion.div {...routingVariants}>
      <Box sx={{ margin: 5 }}>
        <Typography variant="h3">Dashboard</Typography>
        <Box className="flex gap-5 mt-5">
          <Card>
            <Link
              to={"/dashboard/products"}
              className="flex flex-col items-center"
            >
              <CardContent>
                <Typography variant="h4"> Total Products</Typography>
                <Typography variant="h5">{products.length}</Typography>
              </CardContent>
            </Link>
          </Card>
          <Card>
            <CardContent>
              <Link
                to={"/dashboard/products"}
                className="flex flex-col items-center"
              >
                <Typography variant="h4"> Total Users</Typography>
                <Typography variant="h5">{users.length}</Typography>
              </Link>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Dashboard;
