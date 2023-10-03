import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
const AddProductForm = () => {
  const navigate = useNavigate();
  const schema = z.object({
    name: z.string().nonempty("Name cannot be empty"),
    detail: z.string().nonempty("Detail cannot be empty"),
    price: z.string().nonempty("Price cannot be empty"),
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
      price: "",
    },
    resolver: zodResolver(schema),
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
      className="p-5 rounded-lg bg-white shadow-md min-w-[300px] flex flex-col gap-5"
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
        {...register("price")}
        error={!!errors.price}
        helperText={errors.price?.message}
        variant="standard"
        label="Price"
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
