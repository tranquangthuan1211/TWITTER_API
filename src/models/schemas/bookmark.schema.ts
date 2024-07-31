import { ObjectId } from 'mongodb';

export interface BookMarkTypeSchema {
	userId: ObjectId;
	tweetId: ObjectId;
}

class BookMarkSchema {
	_id?: ObjectId;
	userId: ObjectId;
	tweetId: ObjectId;
	createdAt?: Date;

	constructor(bookmark: BookMarkTypeSchema) {
		this.tweetId = new ObjectId(bookmark.tweetId);
		this.userId = new ObjectId(bookmark.userId);
		this.createdAt = new Date();
	}
}

export default BookMarkSchema;
