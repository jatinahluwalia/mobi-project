import { Stack, Typography } from "@mui/material";
import AddProductForm from "../../components/form/AddProductForm";
const AddProduct = () => {
  return (
    <Stack padding={5} direction={"column"}>
      <Typography variant="h3" marginBottom={10}>
        Add a Product
      </Typography>
      <AddProductForm />
    </Stack>
  );
};

export default AddProduct;
