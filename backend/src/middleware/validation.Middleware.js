import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    // validate + clean + return, invalid হলে error throw
    const parsed = schema.parse({
      //👉 schema structure match করার জন্য
      body: req.body,
    });
    //parsed object এর ভিতরে যদি body থাকে তাহলে original req.body replace করে validated data দিয়ে
    if ("body" in parsed) req.body = parsed.body;
    next()
  } catch (error) {
    //যদি error টা Zod validation error হয় তাহলে আমরা custom ভাবে error handle করবো
    if (error instanceof ZodError) {
      error.errors.map((err) => ({
        field: err.path.length ? err.path.join(".") : "unknown",
        message: err.message,
      }));
    }
  }
};
