import { Stack, Typography } from "@mui/material";
import SignupForm from "../../components/form/SignupForm";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
const SignupSuperAdmin = () => {
  return (
    <motion.div {...routingVariants}>
      <Stack padding={5}>
        <Typography variant="h3" marginBottom={5}>
          Add Super Admin
        </Typography>
        <SignupForm url="/api/user/signup-super-admin" />
      </Stack>
    </motion.div>
  );
};

export default SignupSuperAdmin;
