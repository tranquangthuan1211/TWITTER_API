import { ObjectId } from 'mongodb';

export interface HashtagTypeSchema {
	name: string;
}

class HashtagSchema {
	_id?: ObjectId;
	createdAt?: Date;
	name: string;
	sum: number;

	constructor(hashtag: HashtagTypeSchema) {
		this.name = hashtag.name;
		this.createdAt = new Date();
		this.sum = 1;
	}
}

export default HashtagSchema;
