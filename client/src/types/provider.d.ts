export type User = null | {
  _id: string;
  token: string;
};

export type Action = {
  type: "LOGIN" | "LOGOUT";
  payload: User;
};
export type Context = {
  user: User;
  dispatch: React.Dispatch<Action>;
};
