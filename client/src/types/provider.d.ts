export type User = null | {
  _id: string;
  token: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type Action = {
  type: "LOGIN" | "LOGOUT";
  payload: User;
};
export type Context = {
  user: User;
  dispatch: React.Dispatch<Action>;
};
