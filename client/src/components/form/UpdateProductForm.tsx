import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyRupee } from "@mui/icons-material";
import { Button, TextField, TextareaAutosize } from "@mui/material";
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
  hero: string;
  _id: string;
}

const UpdateProductForm = ({ name, detail, price, _id, hero }: Props) => {
  const navigate = useNavigate();

  const schema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    detail: z.string().min(1, "Detail cannot be empty"),
    price: z.number({ invalid_type_error: "Please enter a price" }),
    hero: z.string().min(1, "Hero cannot be empty").max(50, "Hero too long"),
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
      hero,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Schema) => {
    const promise = axios.put(`/api/product/${_id}`, data);
    toast.promise(promise, {
      loading: "Updating product...",
      success: () => {
        navigate("/dashboard/products");
        return "Product updated.";
      },
      error: (error) => {
        const axiosError = error as AxiosError<{ error: string }>;
        return axiosError.response?.data.error || "Error occurred";
      },
    });
  };
  return (
    <div
      className="bg-white flex flex-col gap-5 w-[min(600px,100%)] p-5 rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="outlined"
        label="Name"
      />
      {errors.detail && <p className="text-red-600">{errors.detail.message}</p>}
      {errors.detail && <p className="text-red-600">{errors.detail.message}</p>}
      <TextField
        onKeyDown={blockInvalidChar}
        {...register("price", { valueAsNumber: true })}
        type="number"
        error={!!errors.price}
        helperText={errors.price?.message}
        variant="outlined"
        label="Price"
        InputProps={{ startAdornment: <CurrencyRupee /> }}
      />
      <TextField
        {...register("hero")}
        error={!!errors.hero}
        helperText={errors.hero?.message}
        variant="outlined"
        label="Hero"
      />
      <TextareaAutosize
        {...register("detail")}
        id="detail-area"
        className={`border border-gray-400 p-2 rounded-md focus:outline-none ${
          errors.detail ? "placeholder:text-red-600" : ""
        }`}
        placeholder="Detail"
        minRows={7}
      />
      <Button variant="contained" type="submit">
        Update
      </Button>
    </div>
  );
};

export default UpdateProductForm;
