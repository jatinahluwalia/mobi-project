import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useState, useEffect } from "react";

const DashBoardLayout = () => {
  type User = {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };

  const [data, setData] = useState<User | null>(null);
  const auth = useAuth();

  const navigate = useNavigate();
  const logout = () => {
    auth.dispatch({
      type: "LOGOUT",
      payload: null,
    });
    navigate("/login");
  };
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get<User>("/api/user");
      const data = res.data;
      setData(data);
    };
    getData();
  }, []);
  return (
    <div className="h-screen grid grid-cols-[300px_1fr]">
      <aside className="bg-green-100 flex flex-col divide-y-[1px] divide-gray-800">
        {data && (
          <div className="flex justify-between items-center gap-2 py-2 border-gray-200 px-5 flex-wrap">
            <div className="flex items-center space-x-4">
              <div className="rounded-full h-8 w-8 bg-green-800 text-white grid place-content-center">
                {data.fullName[0]}
              </div>
              <h1 className="text-black">{data.fullName}</h1>
              <div className=" bg-black text-white px-4 py-1 rounded-sm">
                {data.role}
              </div>
              <div
                onClick={() => navigate("/dashboard/update-self")}
                className="h-4 w-4 bg-black text-white p-4 cursor-pointer rounded-full grid place-content-center"
              >
                <EditIcon fontSize="inherit" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="text-black rounded-md bg-white px-6 py-2"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
        <Link to={"/dashboard/products"} className="p-5 hover:bg-white">
          Products
        </Link>
        {["admin", "superadmin"].includes(String(data?.role)) && (
          <Link to={"/dashboard/signup-admin"} className="p-5 hover:bg-white">
            Add Admin
          </Link>
        )}
        {data?.role === "superadmin" && (
          <Link
            to={"/dashboard/signup-super-admin"}
            className="p-5 hover:bg-white"
          >
            Add Super Admin
          </Link>
        )}
      </aside>
      <Outlet />
    </div>
  );
};

export default DashBoardLayout;
