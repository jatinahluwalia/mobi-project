import { Card, CardContent, LinearProgress, Typography } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routingVariants } from "../../utils/animation";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [adminCount, setAdminCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/product/count").then((res) => {
      setProductCount(res.data.count);
    });

    axios.get("/api/user").then((res) => {
      setUser(res.data);
      setLoading(false);
    });

    axios.get("/api/user/count-users").then((res) => {
      setUserCount(res.data.count);
    });

    axios.get("/api/user/count-admins").then((res) => {
      setAdminCount(res.data.count);
    });
  }, []);

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full">
        <LinearProgress />
      </div>
    );

  return (
    <motion.div {...routingVariants}>
      <div className="m-5">
        <Typography variant="h4">Dashboard</Typography>
        <div className="flex gap-5 mt-5">
          {user?.permissions.includes("product-view") && (
            <Card>
              <CardContent>
                <Link
                  to={"/dashboard/products"}
                  className="flex flex-col items-center"
                >
                  <Typography variant="h5"> Total Products</Typography>
                  <Typography variant="h6">{productCount}</Typography>
                </Link>
              </CardContent>
            </Card>
          )}
          {user?.role === "superadmin" && (
            <Card>
              <CardContent>
                <Link
                  to={"/dashboard/users"}
                  className="flex flex-col items-center"
                >
                  <Typography variant="h5"> Total Admins</Typography>
                  <Typography variant="h6">{adminCount}</Typography>
                </Link>
              </CardContent>
            </Card>
          )}

          {(user?.role === "superadmin" || user?.role === "admin") && (
            <Card>
              <CardContent>
                <div className="flex flex-col items-center">
                  <Typography variant="h5"> Total Users</Typography>
                  <Typography variant="h6">{userCount}</Typography>
                </div>
              </CardContent>
            </Card>
          )}
          {user &&
            user.role !== "superadmin" &&
            !user.permissions.includes("product-view") && (
              <Typography variant="h3" marginY={5}>
                You are not allowed any actions.
              </Typography>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
