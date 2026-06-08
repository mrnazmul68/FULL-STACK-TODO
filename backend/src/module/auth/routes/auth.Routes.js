import { Router } from 'express';
import { login, register } from '../controller/auth.Controller.js';
import { validate } from '../../../middleware/validation.Middleware.js';
import { loginSchema, registerSchema } from '../validation/authValidation.js';

export const authRoute = Router()

authRoute.post("/register",validate(registerSchema), register)
authRoute.post("/login",validate(loginSchema), login)