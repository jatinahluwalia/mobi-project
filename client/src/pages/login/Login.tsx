import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/provider";
import { LoginValidationError } from "../../types/validations";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const schema = z.object({
    email: z.string().email("Please enter a valid email"),
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
  });

  const onSubmit = async (data: Schema) => {
    try {
      const res = await axios.post("/api/user/login", data);
      const user = res.data as User;
      auth?.dispatch({
        type: "LOGIN",
        payload: user,
      });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<LoginValidationError>;
      if (axiosError.response && axiosError.response.status === 406) {
        setError(axiosError.response?.data.field, {
          message: axiosError.response?.data.error,
        });
      } else {
        console.log(axiosError.response?.data.error);
      }
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-300">
      <Box
        className="p-5 rounded-lg bg-white shadow-md min-w-[300px] flex flex-col gap-5"
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          variant="standard"
          label="Email"
        />
        <TextField
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          variant="standard"
          label="Password"
          type="password"
        />
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link onClick={() => navigate("/signup")} className="cursor-pointer">
            Signup
          </Link>
        </Typography>
        <Button variant="contained" type="submit">
          Login
        </Button>
      </Box>
    </main>
  );
};

export default Login;
