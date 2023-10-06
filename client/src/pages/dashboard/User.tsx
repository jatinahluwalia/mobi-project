import { Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";

const User = () => {
  const { _id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("/api/user/" + _id);
      const data = res.data;
      setUser(data.user);
    };
    getUser();
    const getAuthUser = async () => {
      const res = await axios.get("/api/user/");
      const data = res.data;
      setAuthUser(data);
    };
    getAuthUser();
  });
  if (authUser?.role !== "superadmin")
    return (
      <Typography variant="h3" padding={5}>
        You are not authorized to view this page
      </Typography>
    );
  return (
    <motion.div {...routingVariants} className="p-5">
      <Typography variant="h2" marginBottom={5}>
        {user?.fullName.split(" ")[0]} Profile
      </Typography>
      <Box>
        <Typography variant="h4" fontWeight={900}>
          {user?.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {user?.role === "superadmin"
            ? "Super Admin"
            : `${user?.role[0].toUpperCase()}${user?.role.slice(1)}`}
        </Typography>
        <Stack direction={"row"} marginTop={5} alignItems={"center"} gap={5}>
          <Typography variant="body1" fontWeight={700} fontSize={24}>
            Email:
          </Typography>
          <Typography variant="body1">{user?.email}</Typography>
        </Stack>
        <Stack direction={"row"} marginTop={1} alignItems={"center"} gap={5}>
          <Typography variant="body1" fontWeight={700} fontSize={24}>
            Phone:
          </Typography>
          <Typography variant="body1">{user?.phone}</Typography>
        </Stack>
      </Box>
    </motion.div>
  );
};

export default User;
