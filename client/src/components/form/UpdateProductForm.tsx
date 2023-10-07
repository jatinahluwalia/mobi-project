import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyRupee } from "@mui/icons-material";
import { Box, Button, TextField, TextareaAutosize } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { blockInvalidChar } from "../../utils/phone";
import { toast } from "sonner";

interface Props {
  name: string;
  detail: string;
  price: number;
  _id: string;
}

const UpdateProductForm = ({ name, detail, price, _id }: Props) => {
  const navigate = useNavigate();

  const schema = z.object({
    name: z.string().nonempty("Name cannot be empty"),
    detail: z.string().nonempty("Detail cannot be empty"),
    price: z.number({ invalid_type_error: "Please enter a price" }),
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
      toast.success("Product updated");
      navigate("/dashboard/products");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    }
  };
  return (
    <Box
      className="p-5 rounded-lg bg-white shadow-md min-w-[300px] flex flex-col gap-5 w-full"
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
      <TextareaAutosize
        {...register("detail")}
        id="detail-area"
        className={`min-w-[500px] border border-gray-400 p-2 rounded-md focus:outline-none ${
          errors.detail ? "placeholder:text-red-600" : ""
        }`}
        placeholder="Detail"
        minRows={7}
      />
      {errors.detail && <p className="text-red-600">{errors.detail.message}</p>}
      {errors.detail && <p className="text-red-600">{errors.detail.message}</p>}
      <TextField
        onKeyDown={blockInvalidChar}
        {...register("price", { valueAsNumber: true })}
        error={!!errors.price}
        helperText={errors.price?.message}
        variant="standard"
        label="Price"
        InputProps={{ startAdornment: <CurrencyRupee /> }}
      />
      <Button variant="contained" type="submit">
        Update
      </Button>
    </Box>
  );
};

export default UpdateProductForm;
