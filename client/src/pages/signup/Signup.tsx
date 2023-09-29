import { Button, TextField, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const nameRegex = /^[A-Za-z]+$/;

const Signup = () => {
  const navigate = useNavigate();
  const schema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .max(100, "Maximum 100 characters"),
    fullName: z.string().regex(nameRegex, "Name can only contain letters"),
    phone: z
      .string()
      .min(10, "Minimum 10 characters")
      .regex(/^[0-9]+$/, "Phone number can only contain numbers"),
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
      phone: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    try {
      await axios.post("/api/user/signup", data);
      navigate("/login");
    } catch (error) {
      const axiosError = error as AxiosError;
      if ((axiosError.response?.data as any).error.includes("password")) {
        setError("password", { message: "Please enter a strong password." });
      }
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-300">
      <article className="p-5 rounded-lg bg-white shadow-md min-w-[300px] flex flex-col gap-5">
        <TextField
          {...register("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          variant="standard"
          label="Full Name"
        />
        <TextField
          {...register("phone")}
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
        <Button
          type="button"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Signup
        </Button>
      </article>
    </main>
  );
};

export default Signup;
