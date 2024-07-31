import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import { BookMarkTypeSchema } from '@/models/schemas/bookmark.schema';
import { BadRequestException } from '@/lib/exception/badRequest.exception';
import messageHelper, { message } from '@/lib/message';
import LikeSchema, { LikeTypeSchema } from '@/models/schemas/like.schema';

class LikeService {
	async addLike(req: LikeTypeSchema) {
		const isBookmark = await databaseService.like.findOne({
			userId: new ObjectId(req.userId),
			tweetId: new ObjectId(req.tweetId)
		});
		if (isBookmark) throw new BadRequestException(messageHelper(message.E0016, 'Liked'));
		await databaseService.like.insertOne(new LikeSchema(req));
	}

	async deleteLike(req: LikeTypeSchema) {
		await databaseService.like.findOneAndDelete({
			userId: new ObjectId(req.userId),
			tweetId: req.tweetId
		});
	}
}

const likeService = new LikeService();
export default likeService;
