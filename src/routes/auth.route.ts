import authController from '@/controllers/auth.controller';
import { registerValidation } from '@/middlewares';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', registerValidation, authController.register);

authRouter.post('/login', authController.login);

authRouter.post('/refresh-token', authController.login);

authRouter.post('/logout', authController.logout);

export default authRouter;
