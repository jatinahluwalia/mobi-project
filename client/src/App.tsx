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
import Users from "./pages/dashboard/Users";
import UserPermissions from "./pages/dashboard/UserPermissions";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  const auth = useAuth();

  return (
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

      {auth.user && (
        <Route path="/dashboard" element={<DashBoardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="update-self" element={<UpdateSelf />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="products/update/:_id" element={<UpdateProduct />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="signup-admin" element={<SignupAdmin />} />
          <Route path="users/permissions/:id" element={<UserPermissions />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
