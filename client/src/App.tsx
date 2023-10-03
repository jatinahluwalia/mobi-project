import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import axios from "axios";
import Signup from "./pages/signup/Signup";
import DashBoardLayout from "./components/layouts/DashBoardLayout";
import UpdateSelf from "./pages/dashboard/UpdateSelf";
import Products from "./pages/dashboard/Products";
import UpdateProduct from "./pages/dashboard/UpdateProduct";
import AddProduct from "./pages/dashboard/AddProduct";
import SignupAdmin from "./pages/dashboard/SignupAdmin";
import SignupSuperAdmin from "./pages/dashboard/SignupSuperAdmin";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  const auth = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={auth?.user ? <Navigate to={"/dashboard"} /> : <Home />}
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
          <Route element={<DashBoardLayout />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="/dashboard/update-self" element={<UpdateSelf />} />
            <Route path="/dashboard/products" element={<Products />} />
            <Route
              path="/dashboard/products/update/:_id"
              element={<UpdateProduct />}
            />
            <Route path="/dashboard/products/add" element={<AddProduct />} />
            <Route path="/dashboard/signup-admin" element={<SignupAdmin />} />
            <Route
              path="/dashboard/signup-super-admin"
              element={<SignupSuperAdmin />}
            />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
