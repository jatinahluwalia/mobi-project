import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("/api/user");
      const data = res.data;
      setUser(data);
    };
    getUser();
  }, []);

  const handleDelete = () => {
    const promise = axios.delete("/api/user");
    toast.promise(promise, {
      success: () => {
        auth.dispatch({ type: "LOGOUT", payload: null });
        navigate("/login");
        return "Account deleted successfully.";
      },
      loading: "Deleting account...",
      error: (error) => {
        const axiosError = error as AxiosError<{ error: string }>;
        return axiosError.response?.data.error || "Error deleting account.";
      },
    });
  };

  return (
    <motion.div {...routingVariants} className="p-5">
      <Typography variant="h2" marginBottom={5}>
        Your Profile
      </Typography>
      <Box>
        <Typography variant="h4" fontWeight={900}>
          {user?.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {user?.role === "Super Admin"
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
        <Box marginTop={3}>
          {user?.role !== "Super Admin" ? (
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button
                endIcon={<Edit />}
                onClick={() => navigate("/dashboard/update-self")}
              >
                Edit
              </Button>

              <Button endIcon={<Delete />} onClick={() => setOpen(true)}>
                Delete
              </Button>
            </ButtonGroup>
          ) : (
            <Button
              endIcon={<Edit />}
              onClick={() => navigate("/dashboard/update-self")}
              variant="outlined"
            >
              Edit
            </Button>
          )}
        </Box>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete}>YES</Button>
            <Button onClick={() => setOpen(false)}>NO</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default Profile;
