import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/auth";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import axios from "axios";
import Signup from "./pages/signup/Signup";
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
      </Routes>
    </Router>
  );
}

export default App;
