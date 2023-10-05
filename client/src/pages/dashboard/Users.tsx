import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
import { Add, Delete, Edit } from "@mui/icons-material";
const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([] as User[]);
  const [user, setUser] = useState<User>({} as User);
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/api/user/all");
      const data = res.data;
      setUsers(data.users);
    };
    getData();
    const getUser = async () => {
      const res = await axios.get("/api/user");
      const data = res.data;
      setUser(data);
    };
    getUser();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const sure = confirm("Sure you want to delete this product?");
      if (sure) {
        await axios.delete(`/api/product/${id}`);
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.section {...routingVariants} className="p-5 grow">
      <Typography variant="h2" marginBlock={5}>
        Users Management
      </Typography>
      <Stack gap={2} direction={"row"}>
        {user?.role === "superadmin" && (
          <Button
            onClick={() => navigate("/dashboard/signup-super-admin")}
            endIcon={<Add />}
            sx={{ marginBottom: 5 }}
            variant="outlined"
          >
            Add Super Admin
          </Button>
        )}
        {["superadmin", "admin"].includes(String(user?.role)) && (
          <Button
            onClick={() => navigate("/dashboard/signup-admin  ")}
            endIcon={<Add />}
            sx={{ marginBottom: 5 }}
            variant="outlined"
          >
            Add Admin
          </Button>
        )}
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Role</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow
                key={user.fullName}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{user.fullName}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">
                  {user.role === "superadmin" && "Super Admin"}
                  {user.role === "admin" && "Admin"}
                  {user.role === "user" && "User"}
                </TableCell>
                <TableCell align="left">
                  <Stack direction={"row"} gap={2}>
                    {/* <IconButton>
                      <Visibility />
                    </IconButton> */}

                    {user?.role === "superadmin" && (
                      <Tooltip title="Edit Permissions">
                        <IconButton
                          onClick={() =>
                            navigate("/dashboard/users/permissions/" + user._id)
                          }
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {user?.permissions?.includes("user-delete") && (
                      <IconButton onClick={() => handleDelete(user._id)}>
                        <Delete />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.section>
  );
};

export default Users;
