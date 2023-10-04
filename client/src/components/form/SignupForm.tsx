import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { SignupValidationError } from "../../types/validations";

const nameRegex = /^[A-Za-z ]+$/;

interface Props {
  url: string;
}

const SignupForm = ({ url }: Props) => {
  const navigate = useNavigate();

  const schema = z.object({
    email: z
      .string()
      .email("Please enter a valid email")
      .max(50, "Email cannot be larger than 50 characters"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .max(32, "Maximum 32 characters"),
    fullName: z
      .string()
      .max(25, "Name cannot be larger than 25 characters.")
      .regex(nameRegex, "Name can only contain letters"),
    phone: z
      .number()
      .nonnegative("Please don't enter negative number.")
      .min(1000000000, "Please enter a 10 digit number")
      .max(9999999999, "Please enter a 10 digit number"),
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
      fullName: "",
      phone: undefined,
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    try {
      await axios.post(url, data);
      navigate("/login");
    } catch (error) {
      const axiosError = error as AxiosError<SignupValidationError>;
      if (axiosError.response?.status === 406) {
        setError(axiosError.response.data.field, {
          message: axiosError.response.data.error,
        });
      }
    }
  };
  return (
    <Box
      className="p-5 rounded-lg bg-white shadow-md min-w-[300px] flex flex-col gap-5"
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        variant="standard"
        label="Full Name"
      />
      <TextField
        {...register("phone", { valueAsNumber: true })}
        type="number"
        error={!!errors.phone}
        helperText={errors.phone?.message}
        variant="standard"
        label="Phone number"
      />
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
        Already have an account?{" "}
        <Link onClick={() => navigate("/login")} className="cursor-pointer">
          Login
        </Link>
      </Typography>
      <Button variant="contained" type="submit">
        Signup
      </Button>
    </Box>
  );
};

export default SignupForm;
