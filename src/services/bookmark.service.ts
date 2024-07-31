import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import BookMarkSchema, { BookMarkTypeSchema } from '@/models/schemas/bookmark.schema';
import { BadRequestException } from '@/lib/exception/badRequest.exception';
import messageHelper, { message } from '@/lib/message';

class BookmarkService {
	async addBookmark(req: BookMarkTypeSchema) {
		const isBookmark = await databaseService.bookmark.findOne({
			userId: new ObjectId(req.userId),
			tweetId: new ObjectId(req.tweetId)
		});
		if (isBookmark) throw new BadRequestException(messageHelper(message.E0016, 'Bookmarked'));
		await databaseService.bookmark.insertOne(new BookMarkSchema(req));
	}

	async deleteBookmark(req: BookMarkTypeSchema) {
		await databaseService.bookmark.findOneAndDelete({
			userId: new ObjectId(req.userId),
			tweetId: new ObjectId(req.tweetId)
		});
	}
}

const bookmarkService = new BookmarkService();
export default bookmarkService;
