import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
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
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";

const nameRegex = /^[A-Za-z ]+$/;

const SignupAdmin = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const schema = z.object({
    email: z
      .string()
      .email("Please enter a valid email")
      .max(50, "Email cannot be larger than 50 characters"),
    password: z
      .string()
      .nonempty("Please enter a password")
      .min(8, "Minimum 8 characters")
      .max(32, "Maximum 32 characters"),
    fullName: z
      .string()
      .nonempty("Please enter a name")
      .max(25, "Name cannot be larger than 25 characters.")
      .regex(nameRegex, "Name can only contain letters"),
    phone: z
      .number({ invalid_type_error: "Please enter a number" })
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

  const [viewChecked, setViewChecked] = useState(false);
  const [editChecked, setEditChecked] = useState(false);
  const [addChecked, setAddChecked] = useState(false);
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [permissions, setPermissions] = useState([] as string[]);
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
        setAddChecked(true);
        const newPermissions = [...prev, "product-edit"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        setAddChecked(false);
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
        setEditChecked(true);
        const newPermissions = [...prev, "product-add"];
        const uniquePermissions = new Set(newPermissions);
        return Array.from(uniquePermissions);
      } else {
        setEditChecked(false);
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
  const onSubmit = async (data: Schema) => {
    try {
      await axios.post("/api/user/signup-admin", { ...data, permissions });
      navigate("/login");
    } catch (error) {
      const axiosError = error as AxiosError<SignupValidationError>;
      if (axiosError.response?.status === 406) {
        setError(axiosError.response.data.field, {
          message: axiosError.response.data.error,
        });
      } else {
        console.log(axiosError);
      }
    }
  };
  return (
    <Stack padding={5} className="w-full items-start">
      <Typography variant="h2" marginBottom={5}>
        Add Admin
      </Typography>
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
          InputProps={{ startAdornment: "+91" }}
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
          type={isVisible ? "text" : "password"}
          InputProps={{
            endAdornment: isVisible ? (
              <IconButton onClick={() => setIsVisible(!isVisible)}>
                <VisibilityIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => setIsVisible(!isVisible)}>
                <VisibilityOffIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      <Typography variant="h3" marginY={5}>
        Permissions
      </Typography>
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
      <Stack alignItems={"end"} className="w-full">
        <Button
          variant="contained"
          sx={{ margin: 5 }}
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default SignupAdmin;
