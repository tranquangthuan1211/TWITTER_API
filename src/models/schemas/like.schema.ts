import { ObjectId } from 'mongodb';

export interface LikeTypeSchema {
	userId: ObjectId;
	tweetId: ObjectId;
}

class LikeSchema {
	_id?: ObjectId;
	userId: ObjectId;
	tweetId: ObjectId;
	createdAt?: Date;

	constructor(hashtag: LikeTypeSchema) {
		this.userId = new ObjectId(hashtag.userId);
		this.tweetId = new ObjectId(hashtag.tweetId);
		this.createdAt = new Date();
	}
}

export default LikeSchema;
