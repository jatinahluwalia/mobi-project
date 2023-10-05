import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
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
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
const UserPermissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userByID, setUserByID] = useState({} as User);
  const [user, setUser] = useState<User>({} as User);
  const [viewChecked, setViewChecked] = useState(false);
  const [editChecked, setEditChecked] = useState(false);
  const [addChecked, setAddChecked] = useState(false);
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [permissions, setPermissions] = useState([] as string[]);
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/api/user/" + id);
      const data = res.data;
      setViewChecked(data.user.permissions.includes("product-view"));
      setEditChecked(data.user.permissions.includes("product-edit"));
      setAddChecked(data.user.permissions.includes("product-add"));
      setDeleteChecked(data.user.permissions.includes("product-delete"));
      setUserByID(data.user);
    };
    getData();
    const getUser = async () => {
      const res = await axios.get("/api/user/");
      const data = res.data;
      setUser(data);
    };
    getUser();
  }, [id]);

  useEffect(() => {
    setPermissions((prev) => {
      if (viewChecked) {
        const newPermissions = [...prev, "product-view"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        setEditChecked(false);
        setAddChecked(false);
        setDeleteChecked(false);
        const newPermissions = prev.filter(
          (permission) => permission !== "product-view"
        );
        return newPermissions;
      }
    });
  }, [viewChecked]);

  useEffect(() => {
    setPermissions((prev) => {
      if (editChecked) {
        setViewChecked(true);
        setAddChecked(true);
        const newPermissions = [...prev, "product-edit"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        setAddChecked(false);
        setDeleteChecked(false);
        const newPermissions = prev.filter(
          (permission) => permission !== "product-edit"
        );
        return newPermissions;
      }
    });
  }, [editChecked]);
  useEffect(() => {
    setPermissions((prev) => {
      if (addChecked) {
        setViewChecked(true);
        setEditChecked(true);
        const newPermissions = [...prev, "product-add"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        setEditChecked(false);
        setDeleteChecked(false);
        const newPermissions = prev.filter(
          (permission) => permission !== "product-add"
        );
        return newPermissions;
      }
    });
  }, [addChecked]);
  useEffect(() => {
    setPermissions((prev) => {
      if (deleteChecked) {
        setViewChecked(true);
        setAddChecked(true);
        setEditChecked(true);
        const newPermissions = [...prev, "product-delete"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        const newPermissions = prev.filter(
          (permission) => permission !== "product-delete"
        );
        return newPermissions;
      }
    });
  }, [deleteChecked]);
  console.log(permissions);

  const handleSave = async () => {
    try {
      await axios.put(`/api/user/update-permissions/${id}`, { permissions });
      navigate("/dashboard/users");
    } catch (error) {
      console.log(error);
    }
  };

  if (user?.role !== "superadmin")
    return (
      <motion.section {...routingVariants} className="p-5 grow">
        <Typography variant="h2" marginBlock={5}>
          User Permissions Management
        </Typography>
        <Typography variant="h4" marginBottom={5}>
          {userByID.fullName}
        </Typography>
        <Typography variant="h6" marginBottom={5}>
          You are not authorized to view this page.
        </Typography>
      </motion.section>
    );
  return (
    <motion.section {...routingVariants} className="p-5 grow">
      <Typography variant="h2" marginBlock={5}>
        User Permissions Management
      </Typography>
      <Typography variant="h4" marginBottom={5}>
        {userByID.fullName}
      </Typography>
      <TableContainer component={Paper}>
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
                      checked={viewChecked}
                      onChange={() => setViewChecked(!viewChecked)}
                    />
                    <Typography>View</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={editChecked}
                      onChange={() => setEditChecked(!editChecked)}
                    />
                    <Typography>Edit</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={addChecked}
                      onChange={() => setAddChecked(!addChecked)}
                    />
                    <Typography>Add</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={deleteChecked}
                      onChange={() => setDeleteChecked(!deleteChecked)}
                    />
                    <Typography>Delete</Typography>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Stack alignItems={"end"}>
        <Button
          variant="contained"
          sx={{ margin: 5 }}
          type="button"
          onClick={handleSave}
        >
          Save
        </Button>
      </Stack>
    </motion.section>
  );
};

export default UserPermissions;
