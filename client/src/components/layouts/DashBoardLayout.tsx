import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowLeft, Logout } from "@mui/icons-material";
import { toast } from "sonner";

const DashBoardLayout = () => {
  const [anchor, setAnchor] = useState<null | HTMLButtonElement>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();

  const navigate = useNavigate();
  const logout = () => {
    auth.dispatch({
      type: "LOGOUT",
      payload: null,
    });
    navigate("/login");
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get<User>("/api/user");
        const data = res.data;
        setUser(data);
        setLoading(false);
      } catch (error) {
        auth.dispatch({ type: "LOGOUT", payload: null });
        navigate("/login");
      }
    };
    getUser();
  }, [auth, navigate]);

  const handleDelete = () => {
    const promise = axios.delete("/api/user");
    toast.promise(promise, {
      loading: "Deleting Account",
      success: () => {
        auth.dispatch({
          type: "LOGOUT",
          payload: null,
        });
        navigate("/login");
        return "Account deleted";
      },
      error: "Error deleting account",
    });
  };

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const open = Boolean(anchor);

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full">
        <LinearProgress />
      </div>
    );

  return (
    <div className="h-screen flex flex-col">
      {user && (
        <div className="border-b flex justify-between items-center gap-2 py-2 border-gray-200   px-5">
          <IconButton onClick={() => navigate("/dashboard")}>
            <Avatar src="/mobi.png"></Avatar>
          </IconButton>
          <IconButton onClick={handleOpen}>
            <Avatar className="!bg-orange-500">{user.fullName[0]}</Avatar>
          </IconButton>
          <Popover
            open={open}
            anchorEl={anchor}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Card>
              <CardContent
                sx={{
                  minWidth: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <IconButton
                  onClick={() => {
                    navigate("/dashboard/profile");
                    handleClose();
                  }}
                >
                  <Avatar className="!bg-orange-500">{user.fullName[0]}</Avatar>
                </IconButton>
                <Typography
                  variant="body1"
                  className="text-black"
                  marginTop={2}
                >
                  {user.fullName}
                </Typography>
                <Typography color={"text.secondary"} variant="body2">
                  {user.role}
                </Typography>
              </CardContent>
              <List className="w-full">
                {["Super Admin"].includes(String(user?.role)) && (
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => navigate("/dashboard/signup-admin")}
                    >
                      <ListItemText
                        primary="Add Admin"
                        secondary="Add another admin"
                      />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
              <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Tooltip title="Edit your account" placement="top">
                  <IconButton
                    onClick={() => navigate("/dashboard/update-self")}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                {user?.role !== "Super Admin" && (
                  <Tooltip title="Delete your account" placement="top">
                    <IconButton onClick={() => setOpenDelete(true)}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                )}
                <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                  <DialogTitle>Delete account?</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete your account?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDelete}>YES</Button>
                    <Button onClick={() => setOpenDelete(false)}>NO</Button>
                  </DialogActions>
                </Dialog>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={logout}
                  endIcon={<Logout />}
                  color="error"
                >
                  Logout
                </Button>
              </CardActions>
            </Card>
          </Popover>
        </div>
      )}
      <section className="grid grid-cols-[300px_1fr] grow">
        <aside className="flex flex-col divide-y-[1px] divide-gray-800 border-r border-gray-200 ">
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard")}>
                <ListItemText primary="Dashboard" secondary="Dashboard Home" />
              </ListItemButton>
            </ListItem>
            {user?.permissions.includes("product-view") && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/dashboard/products")}>
                  <ListItemText
                    primary="Product Management"
                    secondary="Manage products from here"
                  />
                </ListItemButton>
              </ListItem>
            )}
            {["Super Admin"].includes(String(user?.role)) && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/dashboard/admins")}>
                  <ListItemText
                    primary="Admin Management"
                    secondary="Manage admin permissions"
                  />
                </ListItemButton>
              </ListItem>
            )}
            {["Super Admin", "Admin"].includes(String(user?.role)) && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate("/dashboard/customers")}
                >
                  <ListItemText
                    primary="Customer Management"
                    secondary="Manage customers"
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </aside>

        <div className="flex flex-col bg-[#f6f6f6]">
          <div className="p-5">
            <Button
              variant="outlined"
              startIcon={<ArrowLeft />}
              onClick={() => navigate(-1)}
              color="secondary"
              sx={{ backgroundColor: "white" }}
            >
              Back
            </Button>
          </div>
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default DashBoardLayout;
