import axios, { AxiosError } from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Pagination,
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
import {
  Add,
  AdminPanelSettings,
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";
import { toast } from "sonner";

const Users = () => {
  const [pageNum, setPageNum] = useState(1);
  const navigate = useNavigate();
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [user, setUser] = useState<User>({} as User);
  const [open, setOpen] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    const res = await axios.get("/api/user/all/?page=" + pageNum);
    const data = res.data;
    setUsers(data.users);
  }, [pageNum]);

  const getUser = async () => {
    const res = await axios.get("/api/user");
    const data = res.data;
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handlePageChange = (_e: ChangeEvent<unknown>, pageNumber: number) => {
    setPageNum(pageNumber);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (_id: string) => {
    const promise = axios.delete("/api/user/" + _id);
    toast.promise(promise, {
      success: () => {
        setOpen(false);
        getData();
        return "User deleted successfully.";
      },
      error: (error) => {
        const axiosError = error as AxiosError<{ error: string | null }>;
        return axiosError.response?.data.error || "Error deleting user.";
      },
      loading: "Deleting user...",
    });
  };

  const handleMakeAdmin = (_id: string) => {
    const promise = axios.put("/api/user/to-admin", { _id });
    toast.promise(promise, {
      success: () => {
        setOpenRole(false);
        getData();
        return "Role changed successfully";
      },
      loading: "Changing role...",
      error: () => {
        setOpenRole(false);
        return "Error changing role.";
      },
    });
  };

  const colors = ["!bg-orange-500", "!bg-purple-500", "!bg-blue-500"];

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full">
        <LinearProgress />
      </div>
    );

  if (user && user.role !== "superadmin")
    return (
      <Typography variant="h3" padding={5}>
        You are not authorized to view this page
      </Typography>
    );
  return (
    <motion.section {...routingVariants} className="p-5">
      <Typography variant="h2" marginBottom={5}>
        Users Management
      </Typography>
      <Stack gap={2} direction={"row"}>
        {["superadmin"].includes(String(user?.role)) && (
          <Button
            onClick={() => navigate("/dashboard/signup-admin")}
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
            {users?.docs.map(
              (userByID, index) =>
                userByID.role !== "superadmin" && (
                  <TableRow
                    key={`${userByID.fullName}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">
                      <div className="flex items-center gap-5">
                        <Avatar
                          className={colors[Math.floor(Math.random() * 3)]}
                        >
                          {userByID.fullName[0]}
                        </Avatar>
                        <Typography>{userByID.fullName}</Typography>
                      </div>
                    </TableCell>
                    <TableCell align="left">{userByID.email}</TableCell>
                    <TableCell align="left">
                      {userByID.role === "superadmin" && "Super Admin"}
                      {userByID.role === "admin" && "Admin"}
                      {userByID.role === "user" && "User"}
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction={"row"} gap={2}>
                        <Tooltip title="View Profile">
                          <IconButton
                            onClick={() =>
                              navigate("/dashboard/profile/" + userByID._id)
                            }
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>

                        {userByID.role === "admin" ? (
                          <Tooltip title="Edit User">
                            <IconButton
                              onClick={() =>
                                navigate(
                                  "/dashboard/users/update/" + userByID._id
                                )
                              }
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Make admin">
                            <IconButton onClick={() => setOpenRole(true)}>
                              <AdminPanelSettings />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Dialog
                          open={openRole}
                          onClose={() => setOpenRole(false)}
                          aria-labelledby="role-dialog-title"
                          aria-describedby="role-dialog-description"
                        >
                          <DialogTitle id="role-dialog-title">
                            Change Role
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="role-dialog-description">
                              Are you sure you want to make this user admin?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setOpenRole(false)}>
                              NO
                            </Button>
                            <Button
                              onClick={() => handleMakeAdmin(userByID._id)}
                              autoFocus
                            >
                              YES
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <Tooltip title="Delete User">
                          <IconButton onClick={() => setOpen(true)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            Delete Account
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Are you sure you want to delete this account?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>NO</Button>
                            <Button
                              onClick={() => handleDelete(userByID._id)}
                              autoFocus
                            >
                              YES
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
        {users?.totalPages && users.totalPages > 1 && (
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
            }}
            padding={5}
          >
            <Pagination
              count={users?.totalPages}
              page={pageNum}
              onChange={handlePageChange}
            />
          </Stack>
        )}
      </TableContainer>
    </motion.section>
  );
};

export default Users;
