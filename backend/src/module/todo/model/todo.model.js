import mongoose from "mongoose";
import { TODO_STATUS, VALID_TODO_STATUSES } from "../../../shared/enums.js";
import { VALIDATION } from "../../../shared/constants.js";

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
      validate: {
        validator: (v) => v != null && v.trim().length > 0,
        message: "Title is required",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        VALIDATION.DESCRIPTION_MAX_LENGTH,
        `Description cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
      ],
    },
    status: {
      type: String,
      enum: {
        values: VALID_TODO_STATUSES,
        message: `Status must be one of: ${VALID_TODO_STATUSES.join(", ")}`,
      },
      default: TODO_STATUS.ACTIVE,
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

todoSchema.index({ user: 1, status: 1, createdAt: -1 });
todoSchema.index({ user: 1, title: "text", description: "text" });

export const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);
