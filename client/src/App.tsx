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
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  const auth = useAuth();
  axios.defaults.headers["Authorization"] = `${auth.user?.token}`;
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

        <Route element={<DashBoardLayout />}>
          <Route
            path="/dashboard"
            element={
              auth.user ? <div>Dashboard</div> : <Navigate to={"/login"} />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
