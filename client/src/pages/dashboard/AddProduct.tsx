import { Stack, Typography } from "@mui/material";
import AddProductForm from "../../components/form/AddProductForm";
const AddProduct = () => {
  return (
    <Stack className="p-5 flex flex-col">
      <Typography variant="h3" marginBottom={5}>
        Add a Product
      </Typography>
      <AddProductForm />
    </Stack>
  );
};

export default AddProduct;
