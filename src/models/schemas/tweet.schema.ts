import BaseSchema from './base.schema';
import { ObjectId } from 'mongodb';

enum TweetType {
	Tweet,
	Retweet,
	Comment
}

export interface TweetTypeSchema {
	userId: ObjectId;
	content?: string;
	imageUri?: string[];
	tweetType?: TweetType;
	parentId?: ObjectId;
	hashtags?: string[] | ObjectId[];
}

class TweetSchema extends BaseSchema {
	userId: ObjectId;
	content?: string;
	imageUri?: string[];
	tweetType?: TweetType;
	parentId?: ObjectId;
	hashtags?: ObjectId[];

	constructor(tweet: TweetTypeSchema) {
		super();
		this.userId = new ObjectId(tweet.userId);
		this.imageUri = tweet.imageUri;
		this.tweetType = tweet?.tweetType || TweetType.Tweet;
		if (tweet.tweetType !== TweetType.Tweet) this.parentId = new ObjectId(tweet.parentId);
		if (tweet.tweetType === TweetType.Tweet || tweet.tweetType === TweetType.Comment)
			this.content = tweet.content;
		if (tweet.tweetType !== TweetType.Comment) this.hashtags = tweet.hashtags as ObjectId[];
	}
}

export default TweetSchema;
