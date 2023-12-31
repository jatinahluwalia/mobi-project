import mongoose, { InferSchemaType } from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: { type: String, default: "Customer" },
    permissions: [String],
    forgot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

type User = InferSchemaType<typeof userSchema>;

userSchema.plugin(paginate);

const User = mongoose.model<User, mongoose.PaginateModel<User>>(
  "User",
  userSchema,
  "users"
);

export default User;
