declare type LoginValidationError = {
  field: "email" | "password" | "root";
  error: string;
};
declare type SignupValidationError = {
  field:
    | "email"
    | "password"
    | "fullName"
    | "phone"
    | "root"
    | `root.${string}`;
  error: string;
};

declare type UpdateValidationError = {
  field: "email" | "fullName" | "phone" | "root" | `root.${string}`;
  error: string;
};

declare type ResetValidationError = {
  field: "password" | "confirmPassword" | "root" | `root.${string}`;
  error: string;
};
declare type ForgotValidationError = {
  field: "email" | "root" | `root.${string}`;
  error: string;
};
