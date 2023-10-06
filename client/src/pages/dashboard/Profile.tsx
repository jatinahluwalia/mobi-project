import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";

const Profile = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("/api/user");
      const data = res.data;
      setUser(data);
    };
    getUser();
  }, []);
  const handleDelete = () => {
    try {
      const sure = confirm("Sure you want to delete your account?");
      if (sure) {
        axios.delete("/api/user");
        auth.dispatch({ type: "LOGOUT", payload: null });
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
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
        <Box marginTop={3}>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button
              endIcon={<Edit />}
              onClick={() => navigate("/dashboard/update-self")}
            >
              Edit
            </Button>
            {user?.role !== "superadmin" && (
              <Button endIcon={<Delete />} onClick={handleDelete}>
                Delete
              </Button>
            )}
          </ButtonGroup>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Profile;
