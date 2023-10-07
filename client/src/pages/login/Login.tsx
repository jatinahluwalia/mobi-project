import {
  Button,
  IconButton,
  LinearProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "sonner";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loggingIn, setLogginIn] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const schema = z.object({
    email: z
      .string()
      .email("Please enter a valid email")
      .max(50, "Email should be under 50 characters."),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .max(100, "Maximum 100 characters"),
  });
  type Schema = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Schema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = (data: Schema) => {
    setLogginIn(true);
    axios
      .post("/api/user/login", data)
      .then((res) => {
        setLogginIn(false);
        const user = res.data as ContextUser;
        auth?.dispatch({
          type: "LOGIN",
          payload: user,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        setLogginIn(false);
        const axiosError = error as AxiosError<LoginValidationError>;
        if (axiosError.response && axiosError.response.status === 406) {
          setError(axiosError.response?.data.field, {
            message: axiosError.response?.data.error,
          });
        } else {
          console.log(axiosError.response?.data.error);
        }
        toast.error(axiosError.response?.data.error);
      });
  };

  return (
    <main className="min-h-screen flex flex-col place-content-center bg-white">
      <div className="grow grid grid-cols-2 w-[min(900px,100%)] mx-auto gap-5">
        <motion.img
          src="/mobi.png"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1 }}
          className="m-auto"
        />
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center"
        >
          <form
            className=" bg-white min-w-[300px] flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
              label="Email"
            />
            <TextField
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
              label="Password"
              type={isVisible ? "text" : "password"}
              InputProps={{
                endAdornment: isVisible ? (
                  <IconButton onClick={() => setIsVisible(!isVisible)}>
                    <VisibilityIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => setIsVisible(!isVisible)}>
                    <VisibilityOffIcon />
                  </IconButton>
                ),
              }}
            />
            <Typography variant="body2">
              Don't have an account?
              <Link
                onClick={() => navigate("/signup")}
                className="cursor-pointer"
                marginLeft={1}
              >
                Signup
              </Link>
            </Typography>

            <Button variant="contained" type="submit" disabled={loggingIn}>
              Login
            </Button>
            <div className="flex justify-end">
              <Link
                onClick={() => navigate("/forgot")}
                className="cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
      {loggingIn && (
        <div className="fixed top-0 left-0 w-full">
          <LinearProgress />
        </div>
      )}
    </main>
  );
};

export default Login;
