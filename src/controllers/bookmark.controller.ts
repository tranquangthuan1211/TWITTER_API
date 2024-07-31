import { responseSuccess } from '@/lib/common/responseCommon';
import messageHelper, { message } from '@/lib/message';
import bookmarkService from '@/services/bookmark.service';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

class BookmarkController {
	async bookmark(req: Request, res: Response, next: NextFunction) {
		const { tweetId } = req.params;
		try {
			await bookmarkService.addBookmark({
				userId: req.body.userId,
				tweetId: new ObjectId(tweetId)
			});
			return responseSuccess({
				http: 200,
				message: messageHelper(message.I0006, 'Bookmark'),
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async unbookmark(req: Request, res: Response, next: NextFunction) {
		const { tweetId } = req.params;
		try {
			await bookmarkService.deleteBookmark({
				userId: req.body.userId,
				tweetId: new ObjectId(tweetId)
			});
			return responseSuccess({
				http: 200,
				message: messageHelper(message.I0006, 'unBookmark'),
				res
			});
		} catch (error) {
			next(error);
		}
	}
}

const bookmarkController = new BookmarkController();
export default bookmarkController;
