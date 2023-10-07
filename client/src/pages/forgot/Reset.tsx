import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const Reset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const schema = z
    .object({
      password: z
        .string()
        .nonempty("Please enter a password")
        .min(8, "Minimum 8 characters")
        .max(32, "Maximum 32 characters"),
      confirmPassword: z
        .string()
        .nonempty("Please confirm your password")
        .min(8, "Minimum 8 characters")
        .max(32, "Maximum 32 characters"),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "Passwords must match",
      path: ["confirmPassword", "password"],
    });

  type Values = z.infer<typeof schema>;
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<Values>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const onSubmit = async (values: Values) => {
    const promise = axios.post("/api/user/reset", values, {
      headers: { token },
    });
    toast.promise(promise, {
      loading: "Resetting password",
      success: () => {
        navigate("/login");
        return "Password reset successfully";
      },
      error: (err) => {
        const error = err as AxiosError<ResetValidationError>;
        if (error?.response?.status === 406) {
          setError(error.response.data.field, {
            message: error.response.data.error,
          });
          return toast.error(error.response.data.error);
        }
      },
    });
  };
  const handleVisible = () => {
    setIsVisible(!isVisible);
  };
  const handleVisibleConfirm = () => {
    setIsVisibleConfirm(!isVisibleConfirm);
  };
  if (!token) return <Navigate to={"/"} />;
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D1D5DB",
        flexDirection: "column",
      }}
    >
      <Typography variant="h2" component="h1" marginBottom={5}>
        Reset your password
      </Typography>
      <Card>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleVisible}>
                  {isVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
            type={`${isVisible ? "text" : "password"}`}
          />
          <TextField
            label="Confirm Password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleVisibleConfirm}>
                  {isVisibleConfirm ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
            type={`${isVisible ? "text" : "password"}`}
          />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            Reset
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Reset;
