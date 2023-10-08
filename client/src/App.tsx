import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/login/Login";
import axios from "axios";
import Signup from "./pages/signup/Signup";
import DashBoardLayout from "./components/layouts/DashBoardLayout";
import UpdateSelf from "./pages/dashboard/UpdateSelf";
import Products from "./pages/dashboard/Products";
import UpdateProduct from "./pages/dashboard/UpdateProduct";
import AddProduct from "./pages/dashboard/AddProduct";
import SignupAdmin from "./pages/dashboard/SignupAdmin";
import Dashboard from "./pages/dashboard/Dashboard";
import Admins from "./pages/dashboard/Admins";
import AdminUpdate from "./pages/dashboard/AdminUpdate";
import Profile from "./pages/dashboard/Profile";
import User from "./pages/dashboard/User";
import Forgot from "./pages/forgot/Forgot";
import Reset from "./pages/forgot/Reset";
import { Toaster } from "sonner";
import Product from "./pages/dashboard/Product";
import Customers from "./pages/dashboard/Customers";
import CustomerUpdate from "./pages/dashboard/CustomerUpdate";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  const auth = useAuth();

  return (
    <>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route
          path="/"
          element={
            auth?.user ? (
              <Navigate to={"/dashboard"} />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/login"
          element={!auth?.user ? <Login /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/signup"
          element={!auth?.user ? <Signup /> : <Navigate to={"/dashboard"} />}
        />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />

        {auth.user && (
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="update-self" element={<UpdateSelf />} />
            <Route path="products" element={<Products />} />
            <Route path="admins" element={<Admins />} />
            <Route path="products/update/:_id" element={<UpdateProduct />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="signup-admin" element={<SignupAdmin />} />
            <Route path="users/update/:_id" element={<AdminUpdate />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:_id" element={<User />} />
            <Route path="products/:_id" element={<Product />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/update/:_id" element={<CustomerUpdate />} />
          </Route>
        )}
      </Routes>
    </>
  );
}

export default App;
