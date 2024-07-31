import { responseSuccess } from '@/lib/common/responseCommon';
import messageHelper, { message } from '@/lib/message';
import fileService from '@/services/file.service';
import likeService from '@/services/like.service';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import path from 'path';

class LikeController {
	async like(req: Request, res: Response, next: NextFunction) {
		const { tweetId } = req.params;
		try {
			await likeService.addLike({
				userId: req.body.userId,
				tweetId: new ObjectId(tweetId)
			});
			return responseSuccess({
				http: 200,
				message: messageHelper(message.I0006, 'Like'),
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async unlike(req: Request, res: Response, next: NextFunction) {
		const { tweetId } = req.params;
		try {
			await likeService.deleteLike({
				userId: req.body.userId,
				tweetId: new ObjectId(tweetId)
			});
			return responseSuccess({
				http: 200,
				message: messageHelper(message.I0006, 'unLike'),
				res
			});
		} catch (error) {
			next(error);
		}
	}
}

const likeController = new LikeController();
export default likeController;
