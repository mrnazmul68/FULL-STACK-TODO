import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  MONGO_URI: z.string().min(1, "Mongodb is required"),
  JWT_ACCESS_SECRET: z
    .string()
    .min(64, "Access token must be more then 64 charrecters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(64, "Refresh token must be more then 64 charrecters"),
});

const parsed = envSchema.safeParse(process.env);
export const env = Object.freeze(parsed.data);
