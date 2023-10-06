import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { blockInvalidChar } from "../../utils/phone";
import { toast } from "sonner";

const nameRegex = /^[A-Za-z ]+$/;

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userByID, setUserByID] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [viewChecked, setViewChecked] = useState(false);
  const [editChecked, setEditChecked] = useState(false);
  const [addChecked, setAddChecked] = useState(false);
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [permissions, setPermissions] = useState([] as string[]);

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

  const handleSave = async (values: Schema) => {
    try {
      await axios.put(`/api/user/${id}`, { ...values, permissions });
      toast.success("User updated successfully");
      navigate("/dashboard/users");
    } catch (error) {
      const axiosError = error as AxiosError<UpdateValidationError>;
      if (axiosError.response?.status === 406) {
        setError(axiosError.response.data.field, {
          message: axiosError.response.data.error,
        });
      }
    }
  };

  const getData = useCallback(async () => {
    const res = await axios.get("/api/user/" + id);
    const data = res.data;
    setViewChecked(data.user.permissions.includes("product-view"));
    setEditChecked(data.user.permissions.includes("product-edit"));
    setAddChecked(data.user.permissions.includes("product-add"));
    setDeleteChecked(data.user.permissions.includes("product-delete"));
    setValue("email", data.user.email);
    setValue("fullName", data.user.fullName);
    setValue("phone", data.user.phone);
    setUserByID(data.user);
  }, [id, setValue]);

  const getUser = async () => {
    const res = await axios.get("/api/user/");
    const data = res.data;
    setUser(data);
  };

  useEffect(() => {
    setPermissions((prev) => {
      if (viewChecked) {
        const newPermissions = [...prev, "product-view"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        setEditChecked(false);
        setAddChecked(false);
        setDeleteChecked(false);
        const newPermissions = prev.filter(
          (permission) => permission !== "product-view"
        );
        return newPermissions;
      }
    });
  }, [viewChecked]);

  useEffect(() => {
    setPermissions((prev) => {
      if (editChecked) {
        setViewChecked(true);
        const newPermissions = [...prev, "product-edit"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        setDeleteChecked(false);
        const newPermissions = prev.filter(
          (permission) => permission !== "product-edit"
        );
        return newPermissions;
      }
    });
  }, [editChecked]);
  useEffect(() => {
    setPermissions((prev) => {
      if (addChecked) {
        setViewChecked(true);
        const newPermissions = [...prev, "product-add"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        setDeleteChecked(false);
        const newPermissions = prev.filter(
          (permission) => permission !== "product-add"
        );
        return newPermissions;
      }
    });
  }, [addChecked]);
  useEffect(() => {
    setPermissions((prev) => {
      if (deleteChecked) {
        setViewChecked(true);
        setAddChecked(true);
        setEditChecked(true);
        const newPermissions = [...prev, "product-delete"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        const newPermissions = prev.filter(
          (permission) => permission !== "product-delete"
        );
        return newPermissions;
      }
    });
  }, [deleteChecked]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getUser();
  }, []);

  if (user?.role !== "superadmin")
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
      <Typography variant="h4" marginBottom={5}>
        {userByID?.fullName}
      </Typography>
      <Box
        className="p-5 rounded-lg bg-white shadow-md min-w-[300px] flex flex-col gap-5 w-max mb-5"
        component={"form"}
        onSubmit={handleSubmit(handleSave)}
      >
        <TextField
          {...register("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          variant="standard"
          label="Full Name"
        />
        <TextField
          onKeyDown={blockInvalidChar}
          {...register("phone", { valueAsNumber: true })}
          type="number"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          variant="standard"
          label="Phone number"
          InputProps={{ startAdornment: <Typography>+91</Typography> }}
        />
        <TextField
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          variant="standard"
          label="Email"
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Permissions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key="product"
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">Product Management</TableCell>
              <TableCell align="left">
                <Stack direction="row" spacing={2}>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={viewChecked}
                      onChange={() => setViewChecked(!viewChecked)}
                    />
                    <Typography>View</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={editChecked}
                      onChange={() => setEditChecked(!editChecked)}
                    />
                    <Typography>Edit</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={addChecked}
                      onChange={() => setAddChecked(!addChecked)}
                    />
                    <Typography>Add</Typography>
                  </Stack>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Checkbox
                      checked={deleteChecked}
                      onChange={() => setDeleteChecked(!deleteChecked)}
                    />
                    <Typography>Delete</Typography>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Stack alignItems={"end"}>
        <Button
          variant="contained"
          sx={{ margin: 5 }}
          type="button"
          onClick={handleSubmit(handleSave)}
        >
          Save
        </Button>
      </Stack>
    </motion.section>
  );
};

export default UserUpdate;
