import { ObjectId } from 'mongodb';
import databaseService from './database.service';
import { userResponse } from '@/models/response/user.response';
import { formatDateToMonthAndYear } from '@/lib/utils/date';
import UserSchema from '@/models/schemas/user.schema';
import { BadRequestException } from '@/lib/exception/badRequest.exception';
import messageHelper, { message } from '@/lib/message';
import FollowerSchema, { FollowerTypeSchema } from '@/models/schemas/follower.schema';
import { ResourceNotFound } from '@/lib/exception/resourceNotFound';
import { updateUserRequest } from '@/models/request/user.request';
import { omit } from 'lodash';

class UserService {
	async getUserById(id: ObjectId, userId?: ObjectId) {
		if (!ObjectId.isValid(id)) throw new BadRequestException(messageHelper(message.E0014, 'User'));
		const user = (await databaseService.user.findOne({ _id: new ObjectId(id) })) as UserSchema;
		const follow = await databaseService.follower.findOne({
			userId: new ObjectId(userId),
			userFollowedId: new ObjectId(id)
		});
		if (user == null) {
			throw new BadRequestException(messageHelper(message.E0014, 'User'));
		}
		const [follower, following] = await Promise.all([
			this.getFollowers(id),
			this.getFollowings(id)
		]);
		const userResponse: userResponse = {
			userId: user._id?.toHexString() as string,
			userName: user.userName,
			bio: user.bio,
			avatar: user.avatar,
			follower: follower || 0,
			following: following || 0,
			createAt: formatDateToMonthAndYear(user.createdAt!!),
			isFollow: follow != null ? true : false,
			website: user.website
		};
		return userResponse;
	}

	async updateUser(id: ObjectId, req: updateUserRequest) {
		const user = await databaseService.user.findOne({ _id: new ObjectId(id) });
		if (user == null) throw new BadRequestException(messageHelper(message.E0014, 'User'));
		req = omit(req, 'userId');
		await databaseService.user.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: { ...req },
				$currentDate: { updatedAt: true }
			}
		);
	}

	async getFollowers(id: ObjectId) {
		return await databaseService.follower.countDocuments({ userFollowedId: new ObjectId(id) });
	}

	async getFollowings(id: ObjectId) {
		return await databaseService.follower.countDocuments({ userId: new ObjectId(id) });
	}

	async followUser(req: FollowerTypeSchema) {
		if (req.userId === req.userFollowedId)
			throw new BadRequestException(messageHelper('Cannot follow yourself.'));
		const user = await databaseService.user.findOne({ _id: new ObjectId(req.userFollowedId) });
		if (user == null) throw new ResourceNotFound(messageHelper(message.E0014, 'User'));

		const follower = await databaseService.follower.findOne({
			userId: new ObjectId(req.userId),
			userFollowedId: new ObjectId(req.userFollowedId)
		});
		if (follower) throw new BadRequestException(messageHelper(message.E0015));
		else {
			await databaseService.follower.insertOne(new FollowerSchema(req));
		}
		return await this.getUserById(new ObjectId(req.userFollowedId), new ObjectId(req.userId));
	}

	async unFollowUser(req: FollowerTypeSchema) {
		if (req.userId === req.userFollowedId)
			throw new BadRequestException(messageHelper('Cannot unfollow yourself.'));
		const user = await databaseService.user.findOne({ _id: new ObjectId(req.userFollowedId) });
		if (user == null) throw new ResourceNotFound(messageHelper(message.E0014, 'User'));

		databaseService.follower.findOneAndDelete({
			userId: new ObjectId(req.userId),
			userFollowedId: new ObjectId(req.userFollowedId)
		});
		return await this.getUserById(new ObjectId(req.userFollowedId), new ObjectId(req.userId));
	}

	async getUserFollow(userId: ObjectId) {
		const [follower, following] = await Promise.all([
			databaseService.follower
				.aggregate([
					{
						$match: {
							userFollowedId: userId
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
							userFollowedId: 0,
							userId: 0,
							createdA: 0
						}
					}
				])
				.toArray(),
			databaseService.follower
				.aggregate([
					{
						$match: {
							userId: userId
						}
					},
					{
						$lookup: {
							from: 'col_users',
							localField: 'userFollowedId',
							foreignField: '_id',
							as: 'user'
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
							userFollowedId: 0,
							userId: 0,
							createdAt: 0
						}
					}
				])
				.toArray()
		]);

		return { follower, following };
	}
}

const userService = new UserService();
export default userService;
