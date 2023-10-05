import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyRupee } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
const AddProductForm = () => {
  const navigate = useNavigate();
  const schema = z.object({
    name: z
      .string()
      .nonempty("Name cannot be empty")
      .max(50, "Cant be larger than 50 characters")
      .regex(/^[A-Za-z ]/g, "Name can only contain letters"),
    detail: z.string().nonempty("Detail cannot be empty"),
    price: z.number({
      invalid_type_error: "Enter a valid price",
    }),
    hero: z.string().nonempty("Hero cannot be empty"),
  });
  type Schema = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    defaultValues: {
      name: "",
      detail: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data: Schema) => {
    try {
      await axios.post(`/api/product/`, data);
      navigate("/dashboard/products");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    }
  };
  return (
    <Box
      className="p-5 rounded-lg bg-white shadow-md flex flex-col gap-5"
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="standard"
        label="Name"
      />
      <TextField
        {...register("detail")}
        error={!!errors.detail}
        helperText={errors.detail?.message}
        variant="standard"
        label="Detail"
      />
      <TextField
        {...register("price", { valueAsNumber: true })}
        error={!!errors.price}
        helperText={errors.price?.message}
        variant="standard"
        label="Price"
        InputProps={{
          startAdornment: <CurrencyRupee />,
        }}
      />
      <TextField
        {...register("hero")}
        error={!!errors.hero}
        helperText={errors.hero?.message}
        variant="standard"
        label="Hero"
      />
      <Button variant="contained" type="submit">
        Add
      </Button>
    </Box>
  );
};

export default AddProductForm;
