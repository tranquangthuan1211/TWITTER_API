import { ObjectId } from 'mongodb';

class BaseSchema {
	_id?: ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
	isDeleted?: boolean;

	constructor() {
		const date = new Date();
		this.createdAt = date;
		this.updatedAt = date;
		this.isDeleted = false;
	}
}

export default BaseSchema;
