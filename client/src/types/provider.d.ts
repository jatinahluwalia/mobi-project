declare type ContextUser = null | {
  _id: string;
  token: string;
};

declare type Action = {
  type: "LOGIN" | "LOGOUT";
  payload: ContextUser;
};
declare type Context = {
  user: ContextUser;
  dispatch: React.Dispatch<Action>;
};
