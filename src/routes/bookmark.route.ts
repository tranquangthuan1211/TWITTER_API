import bookmarkController from '@/controllers/bookmark.controller';
import { accessTokenValidation } from '@/middlewares';
import express from 'express';

const bookmarkRouter = express.Router();

bookmarkRouter.post('/tweet/:tweetId', accessTokenValidation, bookmarkController.bookmark);

bookmarkRouter.delete('/tweet/:tweetId', accessTokenValidation, bookmarkController.unbookmark);

export default bookmarkRouter;
