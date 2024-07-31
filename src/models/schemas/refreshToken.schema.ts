import { ObjectId } from 'mongodb';

export interface RefreshTokenTypeSchema {
	userId: ObjectId;
	accessToken: string;
	refreshToken: string;
}

class RefreshTokenSchema {
	_id?: ObjectId;
	userId: ObjectId;
	accessToken: string;
	refreshToken: string;
	createdAt?: Date;

	constructor(refreshToken: RefreshTokenTypeSchema) {
		this.userId = refreshToken.userId;
		this.refreshToken = refreshToken.refreshToken;
		this.accessToken = refreshToken.accessToken;
		this.createdAt = new Date();
	}
}

export default RefreshTokenSchema;
