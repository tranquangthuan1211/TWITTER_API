import { ObjectId } from 'mongodb';

export interface tweetDetailResponse {
	_id: ObjectId;
	content: string;
	imageUri?: string[];
	hashtags?: {
		hashtagId: ObjectId;
		name: string;
	}[];
	createdAt: string | Date;
	tweetType: number;
	user: {
		userId: ObjectId;
		userName: string;
		avatar: string;
	};
	likeCount: number;
	bookmarkCount: number;
	reTweetCount: number;
	commentCount: number;
	isLike?: boolean;
	isBookmark?: boolean;
}

export interface tweetResponse {
	_id: ObjectId;
	content: string;
	imageUri?: string[];
	createdAt: string | Date;
	hashtag?: {
		hashtagId: ObjectId;
		name: string;
	}[];
	user: {
		userId: ObjectId;
		userName: string;
		avatar: string;
	};
	isLike?: boolean;
	isBookmark?: boolean;
}

export interface tweetCommentResponse {
	_id: ObjectId;
	content: string;
	createdAt: string | Date;
	imageUri?: string[];
	user: {
		userId: ObjectId;
		userName: string;
		avatar: string;
	};
	isLike?: boolean;
	isBookmark?: boolean;
}
