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
      .nonempty("Please enter an email")
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
  const onSubmit = async (values: Values) => {
    try {
      await axios.post("/api/user/forgot-pass", values);
      toast.success("Mail sent successfully");
    } catch (err) {
      const error = err as AxiosError<ForgotValidationError>;
      if (error?.response?.status === 406) {
        setError(error.response.data.field, {
          message: error.response.data.error,
        });
        return toast.error(error.response.data.error);
      }
    }
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
