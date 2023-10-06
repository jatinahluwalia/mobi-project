import {
  Box,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";

const User = () => {
  const { _id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const getUser = async () => {
    const res = await axios.get("/api/user/" + _id);
    const data = res.data;
    setUser(data.user);
  };
  const getAuthUser = async () => {
    const res = await axios.get("/api/user/");
    const data = res.data;
    setAuthUser(data);
  };
  useEffect(() => {
    getUser();
    getAuthUser();
  }, []);
  if (authUser?.role !== "superadmin")
    return (
      <Typography variant="h3" padding={5}>
        You are not authorized to view this page
      </Typography>
    );
  return (
    <motion.div {...routingVariants} className="p-5 w-full">
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
      <TableContainer component={Paper} sx={{ width: "100%", marginTop: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Permissions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key="product"
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">Product Management</TableCell>
              <TableCell align="left">
                <Stack direction="row" spacing={2}>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={user?.permissions.includes("product-view")}
                      disabled
                    />
                    <Typography>View</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={user?.permissions.includes("product-edit")}
                      disabled
                    />
                    <Typography>Edit</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={user?.permissions.includes("product-add")}
                      disabled
                    />
                    <Typography>Add</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={user?.permissions.includes("product-delete")}
                      disabled
                    />
                    <Typography>Delete</Typography>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

export default User;
