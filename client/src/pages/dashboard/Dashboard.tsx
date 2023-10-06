import { Box, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routingVariants } from "../../utils/animation";

const Dashboard = () => {
  const [products, setProducts] = useState<PaginatedProducts | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  useEffect(() => {
    axios.get("/api/product").then((res) => {
      setProducts(res.data.products);
    });

    axios.get("/api/user").then((res) => {
      setUser(res.data);
    });

    axios.get("/api/user/all").then((res) => {
      setUsers(res.data.users);
    });
  }, []);

  return (
    <motion.div {...routingVariants}>
      <Box sx={{ margin: 5 }}>
        <Typography variant="h3">Dashboard</Typography>
        <Box className="flex gap-5 mt-5">
          {user?.permissions.includes("product-view") && (
            <Card>
              <Link
                to={"/dashboard/products"}
                className="flex flex-col items-center"
              >
                <CardContent>
                  <Typography variant="h4"> Total Products</Typography>
                  <Typography variant="h5">{products?.totalDocs}</Typography>
                </CardContent>
              </Link>
            </Card>
          )}
          {user?.role === "superadmin" && (
            <Card>
              <CardContent>
                <Link
                  to={"/dashboard/users"}
                  className="flex flex-col items-center"
                >
                  <Typography variant="h4"> Total Users</Typography>
                  <Typography variant="h5">{users?.totalDocs}</Typography>
                </Link>
              </CardContent>
            </Card>
          )}
          {user?.role !== "superadmin" &&
            !user?.permissions.includes("product-view") && (
              <Typography variant="h3" marginY={5}>
                You are not allowed any actions.
              </Typography>
            )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default Dashboard;
