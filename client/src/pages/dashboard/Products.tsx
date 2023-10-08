import axios, { AxiosError } from "axios";
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
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { toast } from "sonner";
const Products = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(1);
  const [products, setProducts] = useState<PaginatedProducts | null>(null);
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    const res = await axios.get(
      `/api/product/?page=${pageNum}&search=${query}`
    );
    const data = res.data;
    setProducts(data.products);
  }, [query, pageNum]);

  const getUser = async () => {
    const res = await axios.get("/api/user");
    const data = res.data;
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleDelete = (id: string) => {
    const promise = axios.delete(`/api/product/${id}`);
    toast.promise(promise, {
      loading: "Deleting product",
      success: () => {
        setOpen(false);
        getData();
        return "Product deleted";
      },
      error: (error) => {
        setOpen(false);
        const axiosError = error as AxiosError<{ error: string | null }>;
        return axiosError.response?.data.error || "Error deleting product";
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (_e: ChangeEvent<unknown>, pageNumber: number) => {
    setPageNum(pageNumber);
  };
  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full">
        <LinearProgress />
      </div>
    );
  if (user && !user.permissions.includes("product-view"))
    return (
      <Typography variant="h3" padding={5}>
        You are not authorized to view this page
      </Typography>
    );
  return (
    <motion.section {...routingVariants} className="p-5 grow">
      <Typography variant="h2" marginBottom={5}>
        Products Management
      </Typography>
      <div className="flex gap-5 mb-5">
        {user?.permissions?.includes("product-add") && (
          <Button
            onClick={() => navigate("/dashboard/products/add")}
            endIcon={<Add />}
            variant="outlined"
            sx={{ backgroundColor: "white" }}
          >
            Add Product
          </Button>
        )}
        <TextField
          name="search"
          label="Search by name or detail"
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 450, backgroundColor: "white" }}
        />
      </div>
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
        {products?.totalPages && products.totalPages > 1 && (
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
        )}
      </TableContainer>
    </motion.section>
  );
};

export default Products;
