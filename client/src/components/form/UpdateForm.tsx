import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { blockInvalidChar } from "../../utils/phone";
import { toast } from "sonner";

const nameRegex = /^[A-Za-z ]+$/;

interface Props {
  url: string;
  email: string;
  fullName: string;
  phone: number;
}

const UpdateForm = ({ url, email, fullName, phone }: Props) => {
  const navigate = useNavigate();

  const schema = z.object({
    email: z
      .string()
      .email("Please enter a valid email")
      .max(50, "Email cannot be larger than 50 characters"),
    fullName: z
      .string()
      .min(1, "Please enter your name.")
      .max(25, "Name cannot be larger than 25 characters.")
      .regex(nameRegex, "Name can only contain letters"),
    phone: z
      .number({ invalid_type_error: "Please enter a valid phone number." })
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
      email,
      fullName,
      phone,
    },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = (data: Schema) => {
    const promise = axios.put(url, data).then(() => {});
    toast.promise(promise, {
      loading: "Updating User",
      success: () => {
        navigate("/dashboard");
        return "User updated";
      },
      error(error) {
        const axiosError = error as AxiosError<UpdateValidationError>;
        if (axiosError.response?.status === 406) {
          setError(axiosError.response.data.field, {
            message: axiosError.response.data.error,
          });
        }
        return axiosError.response?.data.error || "Server Error";
      },
    });
  };
  return (
    <form
      className="bg-white w-[min(600px,100%)] flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        variant="outlined"
        label="Full Name"
      />
      <TextField
        onKeyDown={blockInvalidChar}
        {...register("phone", { valueAsNumber: true })}
        type="number"
        error={!!errors.phone}
        helperText={errors.phone?.message}
        variant="outlined"
        label="Phone number"
        InputProps={{ startAdornment: <Typography>+91</Typography> }}
      />
      <TextField
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        variant="outlined"
        label="Email"
      />
      <Button variant="contained" type="submit">
        Update
      </Button>
    </form>
  );
};

export default UpdateForm;
