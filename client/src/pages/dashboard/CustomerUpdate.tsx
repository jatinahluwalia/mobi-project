import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, LinearProgress, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { blockInvalidChar } from "../../utils/phone";
import { toast } from "sonner";

const nameRegex = /^[A-Za-z ]+$/;

const CustomerUpdate = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [userByID, setUserByID] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    setValue,
    formState: { errors },
  } = useForm<Schema>({
    defaultValues: {
      email: "",
      fullName: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const handleSave = (values: Schema) => {
    const promise = axios.put(`/api/user/${_id}`, values).then(() => {});
    toast.promise(promise, {
      success: () => {
        navigate("/dashboard/customers");
        return "User updated";
      },
      loading: "Updating User",
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

  const getData = useCallback(async () => {
    const res = await axios.get("/api/user/" + _id);
    const data = res.data;
    setValue("email", data.user.email);
    setValue("fullName", data.user.fullName);
    setValue("phone", data.user.phone);
    setUserByID(data.user);
  }, [_id, setValue]);

  const getUser = async () => {
    const res = await axios.get("/api/user/");
    const data = res.data;
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getUser();
  }, []);

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full">
        <LinearProgress />
      </div>
    );

  if (user && user.role !== "Super Admin")
    return (
      <motion.section {...routingVariants} className="p-5 grow">
        <Typography variant="h2" marginY={5}>
          Update User
        </Typography>
        <Typography variant="h4" marginBottom={5}>
          {userByID?.fullName}
        </Typography>
        <Typography variant="h6" marginBottom={5}>
          You are not authorized to view this page.
        </Typography>
      </motion.section>
    );
  return (
    <motion.section {...routingVariants} className="p-5 grow">
      <Typography variant="h2" marginY={5}>
        Update User
      </Typography>
      {/* <Typography variant="h4" marginBottom={5}>
        {userByID?.fullName}
      </Typography> */}
      <form
        className="bg-white w-[min(600px,100%)] flex flex-col gap-5 mb-5"
        onSubmit={handleSubmit(handleSave)}
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
      </form>
      <Button
        variant="contained"
        type="button"
        onClick={handleSubmit(handleSave)}
      >
        Save
      </Button>
    </motion.section>
  );
};

export default CustomerUpdate;
