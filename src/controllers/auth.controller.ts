import { responseSuccess } from '@/lib/common/responseCommon';
import messageHelper, { message } from '@/lib/message';
import authService from '@/services/auth.service';
import { NextFunction, Request, Response } from 'express';

class AuthController {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			await authService.register(req.body);
			responseSuccess({ http: 200, message: messageHelper(message.I0001), res });
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await authService.login(req.body);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0006, 'Login'),
				data,
				res
			});
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			await authService.logout(req.headers['authorization']?.substring(7) as string);
			responseSuccess({ http: 200, message: messageHelper(message.I0006, 'Logout'), res });
		} catch (error) {
			next(error);
		}
	}

	async googleLogin(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await authService.getOauthGoogle(req.query.code as string);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0006, 'Login'),
				data,
				res
			});
		} catch (error) {
			next(error);
		}
	}
}

const authController = new AuthController();

export default authController;
