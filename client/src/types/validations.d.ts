export type LoginValidationError = {
  field: "email" | "password" | "root";
  error: string;
};
