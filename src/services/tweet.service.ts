import TweetSchema, { TweetTypeSchema } from '@/models/schemas/tweet.schema';
import databaseService from './database.service';
import HashtagSchema from '@/models/schemas/hashtag.schema';
import { ObjectId } from 'mongodb';
import {
	tweetCommentResponse,
	tweetDetailResponse,
	tweetResponse
} from '@/models/response/tweet.response';
import { formatDateToMonthAndYear, getTimeAgoPost } from '@/lib/utils/date';

class TweetService {
	async checkAndCreateHashTag(hashtags: string[]) {
		return Promise.all(
			hashtags.map(async (hashtag) => {
				const hashtagExist = await databaseService.hashtag.findOne({ name: hashtag });
				if (hashtagExist == null) {
					const newHashtag = new HashtagSchema({ name: hashtag });
					await databaseService.hashtag.insertOne(newHashtag);
					return newHashtag;
				} else {
					return await databaseService.hashtag.findOneAndUpdate(
						{ name: hashtag },
						{ $set: { sum: hashtagExist.sum + 1 } }
					);
				}
			})
		);
	}

	async createTweet(req: TweetTypeSchema) {
		if (req.hashtags) {
			req.hashtags = await this.checkAndCreateHashTag(req.hashtags as string[]).then((res) => {
				return res.map((hashtag) => hashtag?._id as ObjectId);
			});
		}
		const newTweet = new TweetSchema(req);
		await databaseService.tweet.insertOne(newTweet);
	}

	async getDetailTweet(tweetId: ObjectId, userId: ObjectId) {
		const [tweet, commentTweet] = await Promise.all([
			databaseService.tweet
				.aggregate<tweetDetailResponse>([
					{
						$match: {
							_id: tweetId
						}
					},
					{
						$lookup: {
							from: 'col_tweets',
							localField: '_id',
							foreignField: 'parentId',
							as: 'childrenTweet'
						}
					},
					{
						$lookup: {
							from: 'col_users',
							localField: 'userId',
							foreignField: '_id',
							as: 'user'
						}
					},
					{
						$lookup: {
							from: 'col_hashtags',
							localField: 'hashtags',
							foreignField: '_id',
							as: 'hashtags'
						}
					},
					{
						$lookup: {
							from: 'col_bookmarks',
							localField: '_id',
							foreignField: 'tweetId',
							as: 'bookmarkCount'
						}
					},
					{
						$lookup: {
							from: 'col_likes',
							localField: '_id',
							foreignField: 'tweetId',
							as: 'likeCount'
						}
					},
					{
						$lookup: {
							from: 'col_bookmarks',
							let: {
								userId: userId,
								tweetId: '$_id'
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$and: [
												{
													$eq: ['$userId', '$$userId']
												},
												{
													$eq: ['$tweetId', '$$tweetId']
												}
											]
										}
									}
								}
							],
							as: 'isBookmark'
						}
					},
					{
						$lookup: {
							from: 'col_likes',
							let: {
								userId: userId,
								tweetId: '$_id'
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$and: [
												{
													$eq: ['$userId', '$$userId']
												},
												{
													$eq: ['$tweetId', '$$tweetId']
												}
											]
										}
									}
								}
							],
							as: 'isLike'
						}
					},
					{
						$addFields: {
							hashtags: {
								$map: {
									input: '$hashtags',
									as: 'hashtag',
									in: {
										hashtagId: '$$hashtag._id',
										name: '$$hashtag.name'
									}
								}
							},
							user: {
								$map: {
									input: '$user',
									as: 'user',
									in: {
										userId: '$$user._id',
										userName: '$$user.userName',
										avatar: '$$user.avatar'
									}
								}
							},
							bookmarkCount: {
								$size: '$bookmarkCount'
							},
							likeCount: {
								$size: '$likeCount'
							},
							retweetCount: {
								$size: {
									$filter: {
										input: '$childrenTweet',
										as: 'item',
										cond: {
											$eq: ['$$item.tweetType', 1]
										}
									}
								}
							},
							commentCount: {
								$size: {
									$filter: {
										input: '$childrenTweet',
										as: 'item',
										cond: {
											$eq: ['$$item.tweetType', 2]
										}
									}
								}
							},
							isBookmark: {
								$cond: {
									if: {
										$gt: [
											{
												$size: '$isBookmark'
											},
											0
										]
									},
									then: true,
									else: false
								}
							},
							isLike: {
								$cond: {
									if: {
										$gt: [
											{
												$size: '$isLike'
											},
											0
										]
									},
									then: true,
									else: false
								}
							}
						}
					},
					{
						$unwind: {
							path: '$user',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$project: {
							updatedAt: 0,
							isDeleted: 0,
							userId: 0,
							parentId: 0,
							childrenTweet: 0
						}
					}
				])
				.toArray(),
			this.getTweetComment({ userId, tweetId, limit: 10, page: 0 })
		]);
		if (tweet.length > 0) tweet[0].createdAt = getTimeAgoPost(tweet[0].createdAt as Date) as string;
		return {
			tweet: tweet[0],
			commentTweet: commentTweet
		};
	}

	async getTweetComment({
		userId,
		tweetId,
		limit,
		page
	}: {
		userId: ObjectId;
		tweetId: ObjectId;
		limit: number;
		page: number;
	}) {
		const comment = await databaseService.tweet
			.aggregate<tweetCommentResponse>([
				{
					$match: {
						parentId: tweetId,
						tweetType: 2
					}
				},
				{
					$lookup: {
						from: 'col_users',
						localField: 'userId',
						foreignField: '_id',
						as: 'user'
					}
				},
				{
					$lookup: {
						from: 'col_bookmarks',
						let: {
							userId: userId,
							tweetId: '$_id'
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{
												$eq: ['$userId', '$$userId']
											},
											{
												$eq: ['$tweetId', '$$tweetId']
											}
										]
									}
								}
							}
						],
						as: 'isBookmark'
					}
				},
				{
					$lookup: {
						from: 'col_likes',
						let: {
							userId: userId,
							tweetId: '$_id'
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{
												$eq: ['$userId', '$$userId']
											},
											{
												$eq: ['$tweetId', '$$tweetId']
											}
										]
									}
								}
							}
						],
						as: 'isLike'
					}
				},
				{
					$addFields: {
						user: {
							$map: {
								input: '$user',
								as: 'user',
								in: {
									userId: '$$user._id',
									userName: '$$user.userName',
									avatar: '$$user.avatar'
								}
							}
						},
						isBookmark: {
							$cond: {
								if: {
									$gt: [
										{
											$size: '$isBookmark'
										},
										0
									]
								},
								then: true,
								else: false
							}
						},
						isLike: {
							$cond: {
								if: {
									$gt: [
										{
											$size: '$isLike'
										},
										0
									]
								},
								then: true,
								else: false
							}
						}
					}
				},
				{
					$unwind: {
						path: '$user',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$project: {
						updatedAt: 0,
						isDeleted: 0,
						tweetType: 0,
						parentId: 0,
						hashtags: 0,
						userId: 0
					}
				},
				{
					$skip: page * limit
				},
				{
					$limit: limit
				}
			])
			.toArray();
		comment.forEach((item) => {
			item.createdAt = formatDateToMonthAndYear(item.createdAt as Date) as string;
		});
		return comment;
	}

	async getTweet({ userId, limit, page }: { userId: ObjectId; limit: number; page: number }) {
		const tweet = await databaseService.tweet
			.aggregate<tweetResponse>([
				{
					$match: {
						tweetType: 0
					}
				},
				{
					$lookup: {
						from: 'col_hashtags',
						localField: 'hashtags',
						foreignField: '_id',
						as: 'hashtags'
					}
				},
				{
					$lookup: {
						from: 'col_users',
						localField: 'userId',
						foreignField: '_id',
						as: 'user'
					}
				},
				{
					$lookup: {
						from: 'col_bookmarks',
						let: {
							userId: userId,
							tweetId: '$_id'
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{
												$eq: ['$userId', '$$userId']
											},
											{
												$eq: ['$tweetId', '$$tweetId']
											}
										]
									}
								}
							}
						],
						as: 'isBookmark'
					}
				},
				{
					$lookup: {
						from: 'col_likes',
						let: {
							userId: userId,
							tweetId: '$_id'
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{
												$eq: ['$userId', '$$userId']
											},
											{
												$eq: ['$tweetId', '$$tweetId']
											}
										]
									}
								}
							}
						],
						as: 'isLike'
					}
				},
				{
					$addFields: {
						hashtags: {
							$map: {
								input: '$hashtags',
								as: 'hashtag',
								in: {
									hashtagId: '$$hashtag._id',
									name: '$$hashtag.name'
								}
							}
						},
						user: {
							$map: {
								input: '$user',
								as: 'user',
								in: {
									userId: '$$user._id',
									userName: '$$user.userName',
									avatar: '$$user.avatar'
								}
							}
						},
						isBookmark: {
							$cond: {
								if: {
									$gt: [
										{
											$size: '$isBookmark'
										},
										0
									]
								},
								then: true,
								else: false
							}
						},
						isLike: {
							$cond: {
								if: {
									$gt: [
										{
											$size: '$isLike'
										},
										0
									]
								},
								then: true,
								else: false
							}
						}
					}
				},
				{
					$unwind: {
						path: '$user',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$project: {
						updatedAt: 0,
						isDeleted: 0,
						userId: 0,
						parentId: 0,
						tweetType: 0,
						childrenTweet: 0
					}
				},
				{
					$skip: page * limit
				},
				{
					$limit: limit
				}
			])
			.toArray();

		tweet.map((item) => {
			item.createdAt = getTimeAgoPost(item.createdAt as Date) as string;
			return item;
		});
		return tweet;
	}

	async getTweetByUser({
		userId,
		limit,
		page,
		userOwn
	}: {
		userId: ObjectId;
		limit: number;
		page: number;
		userOwn: ObjectId;
	}) {
		const tweet = await databaseService.tweet
			.aggregate<tweetResponse>([
				{
					$match: {
						userId: userId,
						tweetType: 0
					}
				},
				{
					$lookup: {
						from: 'col_hashtags',
						localField: 'hashtags',
						foreignField: '_id',
						as: 'hashtags'
					}
				},
				{
					$lookup: {
						from: 'col_users',
						localField: 'userId',
						foreignField: '_id',
						as: 'user'
					}
				},
				{
					$lookup: {
						from: 'col_bookmarks',
						let: {
							userId: userOwn,
							tweetId: '$_id'
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{
												$eq: ['$userId', '$$userId']
											},
											{
												$eq: ['$tweetId', '$$tweetId']
											}
										]
									}
								}
							}
						],
						as: 'isBookmark'
					}
				},
				{
					$lookup: {
						from: 'col_likes',
						let: {
							userId: userOwn,
							tweetId: '$_id'
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{
												$eq: ['$userId', '$$userId']
											},
											{
												$eq: ['$tweetId', '$$tweetId']
											}
										]
									}
								}
							}
						],
						as: 'isLike'
					}
				},
				{
					$addFields: {
						hashtags: {
							$map: {
								input: '$hashtags',
								as: 'hashtag',
								in: {
									hashtagId: '$$hashtag._id',
									name: '$$hashtag.name'
								}
							}
						},
						user: {
							$map: {
								input: '$user',
								as: 'user',
								in: {
									userId: '$$user._id',
									userName: '$$user.userName',
									avatar: '$$user.avatar'
								}
							}
						},
						isBookmark: {
							$cond: {
								if: {
									$gt: [
										{
											$size: '$isBookmark'
										},
										0
									]
								},
								then: true,
								else: false
							}
						},
						isLike: {
							$cond: {
								if: {
									$gt: [
										{
											$size: '$isLike'
										},
										0
									]
								},
								then: true,
								else: false
							}
						}
					}
				},
				{
					$unwind: {
						path: '$user',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$project: {
						updatedAt: 0,
						isDeleted: 0,
						userId: 0,
						parentId: 0,
						tweetType: 0,
						childrenTweet: 0
					}
				},
				{
					$skip: page * limit
				},
				{
					$limit: limit
				}
			])
			.toArray();
		tweet.map((item) => {
			item.createdAt = getTimeAgoPost(item.createdAt as Date) as string;
			return item;
		});
		return tweet;
	}
}

const tweetService = new TweetService();
export default tweetService;
