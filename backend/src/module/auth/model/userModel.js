import mongoose from "mongoose";
import { VALIDATION } from "../../../shared/constant.js";
import bcrypt from "bcrypt";

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
    },
    password: {
      type: String,
      required: true,
      minlength: VALIDATION.PASSWORD_MIN_LENGTH,
      maxlength: VALIDATION.PASSWORD_MAX_LENGTH,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(
    this.password,
    VALIDATION.BCRYPT_SALT_ROUNDS,
  );
});

export const User = mongoose.model("User", userSchema);
