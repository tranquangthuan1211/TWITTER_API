import authController from '@/controllers/auth.controller';
import { registerValidation } from '@/middlewares';
import express from 'express';

const oauthRouter = express.Router();

oauthRouter.get('/google', authController.googleLogin);

export default oauthRouter;
