import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
const Products = () => {
  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(1);
  const [products, setProducts] = useState<PaginatedProducts | null>(null);
  const [user, setUser] = useState<User>({} as User);
  const getData = async () => {
    const res = await axios.get("/api/product/?page=" + pageNum);
    const data = res.data;
    setProducts(data.products);
  };
  const getUser = async () => {
    const res = await axios.get("/api/user");
    const data = res.data;
    setUser(data);
  };
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    getData();
  }, [pageNum]);

  const handleDelete = async (id: string) => {
    try {
      const sure = confirm("Sure you want to delete this product?");
      if (sure) {
        await axios.delete(`/api/product/${id}`);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (_e: ChangeEvent<unknown>, pageNumber: number) => {
    setPageNum(pageNumber);
  };
  return (
    <motion.section {...routingVariants} className="p-5 grow">
      <Typography variant="h2" marginY={5}>
        Products Management
      </Typography>
      {user?.permissions?.includes("product-add") && (
        <Button
          onClick={() => navigate("/dashboard/products/add")}
          endIcon={<Add />}
          sx={{ marginBottom: 5 }}
          variant="outlined"
        >
          Add Product
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Detail</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.docs.map((product, index) => (
              <TableRow
                key={`${product.name}-${index}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{product.name}</TableCell>
                <TableCell align="left">{product.detail}</TableCell>
                <TableCell align="left">{product.price}</TableCell>
                <TableCell align="left">
                  <Stack direction={"row"} gap={2}>
                    <IconButton>
                      <Visibility />
                    </IconButton>

                    {user?.permissions?.includes("product-edit") && (
                      <IconButton
                        onClick={() =>
                          navigate("/dashboard/products/update/" + product._id)
                        }
                      >
                        <Edit />
                      </IconButton>
                    )}
                    {user?.permissions?.includes("product-delete") && (
                      <IconButton onClick={() => handleDelete(product._id)}>
                        <Delete />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
          padding={5}
        >
          <Pagination
            count={products?.totalPages}
            page={pageNum}
            onChange={handlePageChange}
          />
        </Stack>
      </TableContainer>
    </motion.section>
  );
};

export default Products;
