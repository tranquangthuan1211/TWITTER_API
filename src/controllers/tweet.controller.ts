import { responseSuccess } from '@/lib/common/responseCommon';
import messageHelper, { message } from '@/lib/message';
import tweetService from '@/services/tweet.service';
import { NextFunction, Response, Request } from 'express';
import { parseInt } from 'lodash';
import { ObjectId } from 'mongodb';

class TweetController {
	async createTweet(req: Request, res: Response, next: NextFunction) {
		try {
			tweetService.createTweet(req.body);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async getDetailTweet(req: Request, res: Response, next: NextFunction) {
		try {
			const tweet = await tweetService.getDetailTweet(
				new ObjectId(req.params.tweetId),
				new ObjectId(req.body.userId)
			);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0002),
				data: tweet,
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async getTweetComment(req: Request, res: Response, next: NextFunction) {
		try {
			const tweet = await tweetService.getTweetComment({
				userId: new ObjectId(req.body.userId),
				tweetId: new ObjectId(req.params.tweetId),
				page: parseInt(req.query.page as string) || 0,
				limit: parseInt(req.query.limit as string) || 10
			});
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				data: tweet,
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async getTweet(req: Request, res: Response, next: NextFunction) {
		try {
			const tweet = await tweetService.getTweet({
				userId: new ObjectId(req.body.userId),
				page: parseInt(req.query.page as string) || 0,
				limit: parseInt(req.query.limit as string) || 10
			});
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				data: tweet,
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async getTweetByUser(req: Request, res: Response, next: NextFunction) {
		try {
			const tweet = await tweetService.getTweetByUser({
				userId: new ObjectId(req.params.userId) || new ObjectId(req.body.userId),
				page: parseInt(req.query.page as string) | 0,
				limit: parseInt(req.query.limit as string) | 10,
				userOwn: new ObjectId(req.body.userId)
			});
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				data: tweet,
				res
			});
		} catch (error) {
			next(error);
		}
	}
}

const tweetController = new TweetController();

export default tweetController;
