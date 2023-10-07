import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyRupee } from "@mui/icons-material";
import { Button, TextField, TextareaAutosize } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { blockInvalidChar } from "../../utils/phone";
import { toast } from "sonner";
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

  const onSubmit = (data: Schema) => {
    const promise = axios.post(`/api/product/`, data).then(() => {
      navigate("/dashboard/products");
    });
    toast.promise(promise, {
      loading: "Adding Product...",
      success: "Product added",
      error: (error) => {
        const axiosError = error as AxiosError<any>;
        return axiosError.response?.data.error || "Error adding product";
      },
    });
  };
  return (
    <form
      className="grid gap-5 w-[min(500px,100%)]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="outlined"
        label="Name"
      />
      <TextField
        {...register("hero")}
        error={!!errors.hero}
        helperText={errors.hero?.message}
        variant="outlined"
        label="Hero"
      />
      <TextField
        onKeyDown={blockInvalidChar}
        {...register("price", { valueAsNumber: true })}
        type="number"
        error={!!errors.price}
        helperText={errors.price?.message}
        variant="outlined"
        label="Price"
        InputProps={{
          startAdornment: <CurrencyRupee />,
        }}
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
      {errors.detail && <p className="text-red-600">{errors.detail.message}</p>}

      <Button
        variant="contained"
        type="submit"
        sx={{ width: "max-content", ml: "auto" }}
      >
        Add
      </Button>
    </form>
  );
};

export default AddProductForm;
