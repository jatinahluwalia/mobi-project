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
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowLeft, Logout } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const DashBoardLayout = () => {
  const location = useLocation();
  const [anchor, setAnchor] = useState<null | HTMLButtonElement>(null);
  // const [key, setKey] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();

  const navigate = useNavigate();
  const logout = () => {
    auth.dispatch({
      type: "LOGOUT",
      payload: null as ContextUser,
    });
    navigate("/login");
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get<User>("/api/user");
        const data = res.data;
        setUser(data);
      } catch (error) {
        auth.dispatch({ type: "LOGOUT", payload: null });
        navigate("/login");
      }
    };
    getUser();
  }, []);
  const handleDelete = async () => {
    try {
      const sure = confirm("You sure you want to delete your account?");
      if (sure) {
        await axios.delete("/api/user");
        auth.dispatch({
          type: "LOGOUT",
          payload: null,
        });
        navigate("/login");
      }
    } catch (error) {
      console.log("Error");
    }
  };
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget);
  };
  const handleClose = () => {
    setAnchor(null);
  };
  const open = Boolean(anchor);
  return (
    <div className="h-screen flex flex-col">
      {user && (
        <div className="border-b flex justify-between items-center gap-2 py-2 border-gray-200 px-5">
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton onClick={() => navigate("/dashboard")}>
              <Avatar src="/mobi.png"></Avatar>
            </IconButton>
            {location.pathname !== "/dashboard" && (
              <Button
                variant="outlined"
                endIcon={<ArrowLeft />}
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            )}
          </Stack>
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
                  {user.role === "superadmin" && "Super Admin"}
                  {user.role === "admin" && "Admin"}
                  {user.role === "user" && "User"}
                </Typography>
              </CardContent>
              <List className="w-full">
                {["superadmin"].includes(String(user?.role)) && (
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
                {user?.role !== "superadmin" && (
                  <Tooltip title="Delete your account" placement="top">
                    <IconButton onClick={handleDelete}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                )}
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
        <aside className="flex flex-col divide-y-[1px] divide-gray-800 border-r border-gray-200">
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
            {["superadmin"].includes(String(user?.role)) && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/dashboard/users")}>
                  <ListItemText
                    primary="User Management"
                    secondary="Manage user permissions"
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </aside>
        <div className="flex items-start">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default DashBoardLayout;
