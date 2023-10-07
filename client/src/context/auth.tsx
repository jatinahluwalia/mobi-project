import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

const AuthContext = createContext<Context>({} as Context);

const initialState: ContextUser = null;

const authReducer = (state: ContextUser, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    case "LOGOUT":
      sessionStorage.removeItem("user");
      return null;
    default:
      return state;
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  axios.defaults.headers["Authorization"] = `Bearer ${state?.token}`;
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      dispatch({
        type: "LOGIN",
        payload: JSON.parse(user),
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user: state, dispatch: dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
