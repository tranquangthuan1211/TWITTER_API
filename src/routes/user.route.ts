import userController from '@/controllers/user.controller';
import { accessTokenValidation, updateUserValidation } from '@/middlewares';
import express from 'express';
const userRouter = express.Router();

userRouter.get('/', accessTokenValidation, userController.getUser);

userRouter.put('/', accessTokenValidation, updateUserValidation, userController.updateUser);

userRouter.get('/:userId', accessTokenValidation, userController.getUser);

userRouter.get('/follow/:userId', accessTokenValidation, userController.getUserFollow);

userRouter.post('/follow', accessTokenValidation, userController.followUser);

userRouter.post('/unfollow', accessTokenValidation, userController.unFollowUser);

export default userRouter;
