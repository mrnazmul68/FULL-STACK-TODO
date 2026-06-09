import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
    });

    if ("body" in parsed) req.body = parsed.body;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => ({
        // ✅ errors → issues
        field: err.path.length ? err.path.join(".") : "unknown",
        message: err.message,
      }));

      res.status(422).json({
        success: false,
        errors,
      });
    } else {
      next(error);
    }
  }
};
