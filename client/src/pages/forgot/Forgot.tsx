import { Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

const Forgot = () => {
  const schema = z.object({
    email: z
      .string()
      .min(1, "Please enter an email")
      .email("Please enter a valid email")
      .max(50, "Email can't be larger than 50 characters."),
  });

  type Values = z.infer<typeof schema>;
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<Values>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });
  const onSubmit = (values: Values) => {
    const promise = axios.post("/api/user/forgot-pass", values);
    toast.promise(promise, {
      success: "Mail sent successfully.",
      loading: "Sending mail...",
      error: (error) => {
        const err = error as AxiosError<ForgotValidationError>;
        if (err?.response?.status === 406) {
          setError(err.response.data.field, {
            message: err.response.data.error,
          });
          return err.response.data.error || "Some error occurred.";
        }
      },
    });
  };
  return (
    <div className="min-h-[100dvh] grid place-content-center">
      <div className="grid gap-5">
        <Typography variant="h2" component="h1" marginBottom={5}>
          Forgot Password?
        </Typography>
        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
        <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
          Send mail
        </Button>
      </div>
    </div>
  );
};

export default Forgot;
