import { Router } from 'express';
import { register } from '../controller/auth.Controller.js';
import { validate } from '../../../middleware/validation.Middleware.js';
import { registerSchema } from '../validation/authValidation.js';

export const authRoute = Router()

authRoute.post("/register",validate(registerSchema), register)