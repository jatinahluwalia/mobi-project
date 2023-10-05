import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { UpdateValidationError } from "../../types/validations";

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
      .nonempty("Please enter your name.")
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

  const onSubmit = async (data: Schema) => {
    try {
      await axios.put(url, data);
      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<UpdateValidationError>;
      if (axiosError.response?.status === 422) {
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
      <Button variant="contained" type="submit">
        Update
      </Button>
    </Box>
  );
};

export default UpdateForm;
