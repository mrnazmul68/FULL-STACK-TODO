import mongoose from "mongoose";
import { VALIDATION } from "../../../shared/constant.js";
import {
  PRIORITY_STATUS,
  TODO_STATUS,
  VALID_PRIORITY_STATUS,
  VALID_TODO_STATUS,
} from "../../../shared/enums.js";

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [
        VALIDATION.TITLE_MAX_LENGTH,
        `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`,
      ],
      //pro-1
      validate: {
        validator: (v) => v != null && v.trim().length > 0,
        message: "Title is required",
      },
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: [
        VALIDATION.DESCRIPTION_MAX_LENGTH,
        `Description cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
      ],
    },
    status: {
      type: String,
      enum: {
        values: VALID_TODO_STATUS,
        message: `Status must be one of: ${VALID_TODO_STATUS.join(", ")}`,
      },
      default: TODO_STATUS.ACTIVE,
    },
    priority: {
      type: String,
      enum: {
        values: VALID_PRIORITY_STATUS,
        message: `Priority must be one of: ${VALID_PRIORITY_STATUS.join(", ")}`,
      },
      default: PRIORITY_STATUS.LOW,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  },
);
export const title_collation = { locale: "en", strength: 2 };

todoSchema.index({ user: 1, priority: 1 });
todoSchema.index({ user: 1, dueDate: 1 });
todoSchema.index(
  { user: 1, title: 1 },
  { unique: true, collation: title_collation },
);
todoSchema.index({ user: 1 });
todoSchema.index({ user: 1, status: 1, createdAt: -1 });
todoSchema.index({ user: 1, title: "text", description: "text" });

export const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);
