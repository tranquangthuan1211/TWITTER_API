import { responseSuccess } from '@/lib/common/responseCommon';
import messageHelper, { message } from '@/lib/message';
import FollowerSchema from '@/models/schemas/follower.schema';
import userService from '@/services/user.service';
import { NextFunction, Response, Request } from 'express';
import { ObjectId } from 'mongodb';

class UserController {
	async getUser(req: Request, res: Response, next: NextFunction) {
		const { userId } = req.params;
		try {
			const user = await userService.getUserById(
				(userId || req.body.userId) as ObjectId,
				req.body.userId as ObjectId
			);
			user.isOwn = userId == req.body.userId || !userId;
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				data: user,
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async updateUser(req: Request, res: Response, next: NextFunction) {
		try {
			await userService.updateUser(req.body.userId, req.body);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async followUser(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await userService.followUser(req.body);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				data,
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async unFollowUser(req: Request, res: Response, next: NextFunction) {
		try {
			const data = userService.unFollowUser(req.body);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				data,
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async getUserFollow(req: Request, res: Response, next: NextFunction) {
		const { userId } = req.params;
		try {
			const data = await userService.getUserFollow(
				new ObjectId(userId) || new ObjectId(req.body.userId)
			);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0001),
				data,
				res
			});
		} catch (error) {
			next(error);
		}
	}
}

const userController = new UserController();

export default userController;
