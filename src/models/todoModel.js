import mongoose from "mongoose";
import { todo_status, valid_status, validation } from "../constant";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: validation.title_maxLength,
    },
    description: {
      type: String,
      required: [true, "Description required"],
      trim: true,
      maxLength: validation.description_maxLength,
    },
    status: {
      type: String,
      required: [true, "status required"],
      enum: [todo_status, `You have to select one of ${valid_status}`],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false },
);

todoSchema.index({ status: 1, createdAt: -1 });
export const Todo = mongoose.model("Todo", todoSchema);
