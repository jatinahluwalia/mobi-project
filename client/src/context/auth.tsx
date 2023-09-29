import { createContext, useContext, useEffect, useReducer } from "react";

interface User {
  user: Record<string, any>;
  dispatch: any;
}

const AuthContext = createContext<null | User>(null);

const initialState = {
  user: null,
};

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

const AuthProvider = (props: any) => {
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
    <AuthContext.Provider value={{ user: state.user, dispatch }} {...props} />
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
