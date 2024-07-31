import { ObjectId } from 'mongodb';

export interface FollowerTypeSchema {
	userId: ObjectId;
	userFollowedId: ObjectId;
}

class FollowerSchema {
	_id?: ObjectId;
	userId: ObjectId;
	userFollowedId: ObjectId;
	createdAt?: Date;

	constructor(follower: FollowerTypeSchema) {
		this.userId = new ObjectId(follower.userId);
		this.userFollowedId = new ObjectId(follower.userFollowedId);
		this.createdAt = new Date();
	}
}

export default FollowerSchema;
