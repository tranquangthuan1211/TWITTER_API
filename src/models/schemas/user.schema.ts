import BaseSchema from './base.schema';

export interface UserTypeSchema {
	email: string;
	password: string;
	userName: string;
}

class UserSchema extends BaseSchema {
	email: string;
	password: string;
	userName: string;
	avatar: string = '';
	bio: string = '';
	website: string = '';
	dateOfBirth?: Date;

	constructor(user: UserTypeSchema) {
		super();
		this.email = user.email;
		this.password = user.password;
		this.userName = user.userName;
		this.avatar =
			'https://res.cloudinary.com/dryf5c9eh/image/upload/v1702880344/avatar-trang-4_eyizzv.jpg';
	}
}

export default UserSchema;
