import { verifyToken } from '@/lib/security/tokenProvider';
import { validate } from '@/lib/utils/validate';
import databaseService from '@/services/database.service';
import { NextFunction, Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const registerValidation = validate(
	checkSchema({
		email: {
			in: ['body'],
			isEmail: {
				errorMessage: 'Invalid email'
			},
			trim: true,
			notEmpty: true
		},
		password: {
			in: ['body'],
			isLength: {
				errorMessage: 'Password must be at least 6 chars long and less than 20 chars',
				options: { min: 6, max: 20 }
			},
			trim: true,
			notEmpty: true
		},
		userName: {
			in: ['body'],
			trim: true,
			notEmpty: true,
			errorMessage: 'UserName is required'
		}
	})
);

const updateUserValidation = validate(
	checkSchema({
		userName: {
			in: ['body'],
			trim: true,
			notEmpty: true,
			errorMessage: 'UserName is required'
		}
	})
);

const accessTokenValidation = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.headers['authorization']?.substring(7);
		const userId = (await verifyToken({ token: accessToken as string })).userId;
		const user = await databaseService.refreshToken.findOne({ accessToken, userId });
		if (!accessToken && !user) {
			throw new JsonWebTokenError('Token invalid');
		}
		req.body.userId = userId;
		next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			next(new JsonWebTokenError('Token expired'));
		} else next(new JsonWebTokenError('Unauthorized'));
	}
};

export { registerValidation, accessTokenValidation, updateUserValidation };
