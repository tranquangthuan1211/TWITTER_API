import BookMarkSchema from '@/models/schemas/bookmark.schema';
import FollowerSchema from '@/models/schemas/follower.schema';
import HashtagSchema from '@/models/schemas/hashtag.schema';
import LikeSchema from '@/models/schemas/like.schema';
import RefreshTokenSchema from '@/models/schemas/refreshToken.schema';
import TweetSchema from '@/models/schemas/tweet.schema';
import UserSchema from '@/models/schemas/user.schema';
import { config } from 'dotenv';
import { Collection, Db, MongoClient } from 'mongodb';

config();
const uri = process.env.MONGO_URI as string;

class DatabaseService {
	private client: MongoClient;
	private db: Db;

	constructor() {
		this.client = new MongoClient(uri);
		this.db = this.client.db('twitter-api');
	}

	async connect() {
		try {
			// Connect the client to the server	(optional starting in v4.7)
			await this.client.connect();
			// Send a ping to confirm a successful connection
			await this.client.db('twitter-api').command({ ping: 1 });
			console.log('Pinged your deployment. You successfully connected to MongoDB!');
		} finally {
			// Ensures that the client will close when you finish/error
			// await this.client.close();
		}
	}

	get user(): Collection<UserSchema> {
		return this.db.collection('col_users');
	}

	get refreshToken(): Collection<RefreshTokenSchema> {
		return this.db.collection('col_refresh_tokens');
	}

	get follower(): Collection<FollowerSchema> {
		return this.db.collection('col_followers');
	}

	get tweet(): Collection<TweetSchema> {
		return this.db.collection('col_tweets');
	}

	get hashtag(): Collection<HashtagSchema> {
		return this.db.collection('col_hashtags');
	}

	get bookmark(): Collection<BookMarkSchema> {
		return this.db.collection('col_bookmarks');
	}

	get like(): Collection<LikeSchema> {
		return this.db.collection('col_likes');
	}
}

const databaseService = new DatabaseService();
export default databaseService;
