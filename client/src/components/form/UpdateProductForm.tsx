import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

interface Props {
  name: string;
  detail: string;
  price: string;
  _id: string;
}

const UpdateProductForm = ({ name, detail, price, _id }: Props) => {
  const navigate = useNavigate();

  const schema = z.object({
    name: z.string().nonempty("Name cannot be empty"),
    detail: z.string().nonempty("Detail cannot be empty"),
    price: z.string().nonempty("Price cannot be empty"),
  });
  type Schema = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    defaultValues: {
      name,
      detail,
      price,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    try {
      await axios.put(`/api/product/${_id}`, data);
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
      <Button variant="contained" type="submit">
        Update
      </Button>
    </Box>
  );
};

export default UpdateProductForm;
