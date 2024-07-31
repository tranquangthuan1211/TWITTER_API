type userResponse = {
	userId: string;
	userName: string;
	avatar: string;
	bio: string;
	createAt: string;
	follower?: number;
	following?: number;
	isOwn?: boolean;
	isFollow?: boolean;
	website?: string;
};

type userFollow = {
	_id: String;
	user: {
		userId: String;
		userName: String;
		avatar: String;
	};
};

type userFollowResponse = {
	follower: userFollow[];
	following: userFollow[];
};

export { userResponse };
