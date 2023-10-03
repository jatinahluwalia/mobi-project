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
  phone: string;
}

const UpdateForm = ({ url, email, fullName, phone }: Props) => {
  const navigate = useNavigate();

  const schema = z.object({
    email: z.string().email("Please enter a valid email"),

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
      email,
      fullName,
      phone,
    },
    resolver: zodResolver(schema),
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
      <Button variant="contained" type="submit">
        Update
      </Button>
    </Box>
  );
};

export default UpdateForm;
