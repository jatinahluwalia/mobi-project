import { Stack, Typography } from "@mui/material";
import SignupForm from "../../components/form/SignupForm";
import { routingVariants } from "../../utils/animation";
import { motion } from "framer-motion";
const SignupAdmin = () => {
  return (
    <motion.div {...routingVariants}>
      <Stack padding={5}>
        <Typography variant="h3" marginBottom={5}>
          Add Admin
        </Typography>
        <SignupForm url="/api/user/signup-admin" />
      </Stack>
    </motion.div>
  );
};

export default SignupAdmin;
