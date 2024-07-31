import tweetController from '@/controllers/tweet.controller';
import { accessTokenValidation } from '@/middlewares';
import { getTweetPageValidator } from '@/middlewares/tweet.middeware';
import express from 'express';

const tweetRouter = express.Router();

tweetRouter.get('/', accessTokenValidation, getTweetPageValidator, tweetController.getTweet);
tweetRouter.get('/:tweetId', accessTokenValidation, tweetController.getDetailTweet);
tweetRouter.get('/:tweetId/comment', getTweetPageValidator, tweetController.getTweetComment);
tweetRouter.get(
	'/user/:userId',
	accessTokenValidation,
	getTweetPageValidator,
	tweetController.getTweetByUser
);
tweetRouter.post('/', accessTokenValidation, tweetController.createTweet);

export default tweetRouter;
