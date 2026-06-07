import mongoose from "mongoose";
import { VALIDATION } from "../../../shared/constant.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: VALIDATION.NAME_MIN_LENGTH,
      maxlength: VALIDATION.NAME_MAX_LENGTH,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      select: false,
    },
    password: {
      type: String,
      required: true,
      minlength: VALIDATION.PASSWORD_MIN_LENGTH,
      maxlength: VALIDATION.PASSWORD_MAX_LENGTH,
      select: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = mongoose.model("User", userSchema)
