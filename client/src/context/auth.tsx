import { createContext, useEffect, useReducer } from "react";
import { Action, Context, User } from "../types/provider";

const AuthContext = createContext<Context>({} as Context);

const initialState: User = null;

const authReducer = (state: User, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    case "LOGOUT":
      localStorage.removeItem("user");
      return null;
    default:
      return state;
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const user = localStorage.getItem("user");
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
