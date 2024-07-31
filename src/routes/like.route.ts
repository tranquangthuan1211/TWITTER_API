import likeController from '@/controllers/like.controller';
import { accessTokenValidation } from '@/middlewares';
import express from 'express';

const likeRouter = express.Router();

likeRouter.post('/tweet/:tweetId', accessTokenValidation, likeController.like);

likeRouter.delete('/tweet/:tweetId', accessTokenValidation, likeController.unlike);

export default likeRouter;
