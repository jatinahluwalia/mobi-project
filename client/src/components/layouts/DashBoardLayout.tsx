import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const DashBoardLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const logout = () => {
    auth.dispatch({
      type: "LOGOUT",
      payload: null,
    });
    navigate(0);
  };
  return (
    <div className="h-screen grid grid-cols-[400px_1fr]">
      <aside className="bg-green-100">
        {auth.user && (
          <div className="flex justify-between items-center h-16 border-b border-gray-200 px-5">
            <div className="flex items-center space-x-4">
              <div className="rounded-full h-8 w-8 bg-green-800 text-white grid place-content-center">
                {auth.user.fullName[0]}
              </div>
              <h1 className="text-black">{auth.user.fullName}</h1>
              <div className="-m-2 bg-black text-white px-4 py-1 rounded-sm">
                {auth.user.role}
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
      </aside>
      <Outlet />
    </div>
  );
};

export default DashBoardLayout;
