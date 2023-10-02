export type LoginValidationError = {
  field: "email" | "password" | "root";
  error: string;
};
export type SignupValidationError = {
  field:
    | "email"
    | "password"
    | "fullName"
    | "phone"
    | "root"
    | `root.${string}`;
  error: string;
};
