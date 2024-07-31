export type loginRequest = {
	email: string;
	password: string;
};

export type updateUserRequest = {
	userName: string;
	bio?: string;
	website?: string;
	avatar: string;
};
