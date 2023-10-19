import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  LinearProgress,
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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { blockInvalidChar } from "../../utils/phone";
import { toast } from "sonner";

const nameRegex = /^[A-Za-z ]+$/;

const AdminUpdate = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [userByID, setUserByID] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [viewChecked, setViewChecked] = useState(false);
  const [editChecked, setEditChecked] = useState(false);
  const [addChecked, setAddChecked] = useState(false);
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [permissions, setPermissions] = useState([] as string[]);
  const [loading, setLoading] = useState(true);

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
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const handleSave = (values: Schema) => {
    const promise = axios
      .put(`/api/user/update-admin/${_id}`, { ...values, permissions })
      .then(() => {});
    toast.promise(promise, {
      success: () => {
        navigate("/dashboard/admins");
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
    setViewChecked(data.user.permissions.includes("product-view"));
    setEditChecked(data.user.permissions.includes("product-edit"));
    setAddChecked(data.user.permissions.includes("product-add"));
    setDeleteChecked(data.user.permissions.includes("product-delete"));

    setUserByID(data.user);
  }, [_id]);

  const getUser = async () => {
    const res = await axios.get("/api/user/");
    const data = res.data;
    setUser(data);
    setLoading(false);
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
          Update Admin
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
    userByID && (
      <motion.section {...routingVariants} className="p-5 grow">
        <Typography variant="h2" marginY={5}>
          Update Admin
        </Typography>
        {/* <Typography variant="h4" marginBottom={5}>
        {userByID?.fullName}
      </Typography> */}
        <form
          className="bg-white w-[min(600px,100%)] flex flex-col gap-5 mb-5 p-5 rounded-md"
          onSubmit={handleSubmit(handleSave)}
        >
          <Controller
            name="fullName"
            control={control}
            defaultValue={userByID.fullName}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                variant="outlined"
                label="Full Name"
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            defaultValue={userByID.phone}
            render={() => (
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
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue={userByID.email}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
                variant="outlined"
                label="Full Name"
              />
            )}
          />
        </form>
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
    )
  );
};

export default AdminUpdate;
