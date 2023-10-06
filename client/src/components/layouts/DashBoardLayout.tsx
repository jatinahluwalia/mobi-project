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
  Tooltip,
  Typography,
} from "@mui/material";

const DashBoardLayout = () => {
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
      const res = await axios.get<User>("/api/user");
      const data = res.data;
      setUser(data);
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
                <Typography variant="h3" className="text-black">
                  {user.fullName}
                </Typography>
                <Typography color={"text.secondary"}>
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
                <Tooltip title="Delete your account" placement="top">
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Popover>
          <div className="flex items-center space-x-4">
            <Button variant="contained" type="button" onClick={logout}>
              Logout
            </Button>
          </div>
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
