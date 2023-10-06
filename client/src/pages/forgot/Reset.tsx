import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast, Toaster } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const Reset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  if (!token) navigate("/");
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
      path: ["confirmPassword"],
    });

  type Values = z.infer<typeof schema>;
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Values>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });
  const onSubmit = async (values: Values) => {
    try {
      await axios.post("/api/user/reset", values, { headers: { token } });
      toast.success("Password Reset Successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const error = err as AxiosError;
      const errorData = error.response?.data as any;
      toast.error(String(errorData.error));
    }
  };
  const [isVisible, setIsVisible] = useState(false);
  const handleVisible = () => {
    setIsVisible(!isVisible);
  };
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
                <IconButton onClick={handleVisible}>
                  {isVisible ? <Visibility /> : <VisibilityOff />}
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
      <Toaster richColors />
    </Box>
  );
};

export default Reset;
