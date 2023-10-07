import axios from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { toast } from "sonner";
const Products = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(1);
  const [products, setProducts] = useState<PaginatedProducts | null>(null);
  const [user, setUser] = useState<User>({} as User);

  const getData = useCallback(async () => {
    const res = await axios.get("/api/product/?page=" + pageNum);
    const data = res.data;
    setProducts(data.products);
  }, [pageNum]);

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
  }, [getData]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/product/${id}`);
      setOpen(false);
      toast.success("Product deleted successfully");
      getData();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const handleClose = () => {
    setOpen(false);
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
                key={`${product.name}-${index}-${product.price}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{product.name}</TableCell>
                <TableCell align="left">{`${product.detail.slice(
                  0,
                  30
                )}  ...  ${product.detail.slice(
                  product.detail.length - 15,
                  product.detail.length
                )}`}</TableCell>
                <TableCell align="left">{product.price}</TableCell>
                <TableCell align="left">
                  <Stack direction={"row"} gap={2}>
                    <IconButton
                      onClick={() =>
                        navigate("/dashboard/products/" + product._id)
                      }
                    >
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
                      <IconButton onClick={() => setOpen(true)}>
                        <Delete />
                      </IconButton>
                    )}
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        Delete Product
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure you want to delete this Product?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>NO</Button>
                        <Button
                          onClick={() => handleDelete(product._id)}
                          autoFocus
                        >
                          YES
                        </Button>
                      </DialogActions>
                    </Dialog>
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
