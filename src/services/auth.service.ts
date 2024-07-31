import { UserTypeSchema } from '@/models/schemas';
import databaseService from './database.service';
import UserSchema from '@/models/schemas/user.schema';
import { hashPassword } from '@/lib/security/passwordHash';
import { BadRequestException } from '@/lib/exception/badRequest.exception';
import messageHelper, { message } from '@/lib/message';
import { loginRequest } from '@/models/request/user.request';
import { signToken } from '@/lib/security/tokenProvider';
import RefreshTokenSchema from '@/models/schemas/refreshToken.schema';
import { ResourceNotFound } from '@/lib/exception/resourceNotFound';

class AuthService {
	async register(req: UserTypeSchema) {
		if (await databaseService.user.findOne({ email: req.email })) {
			throw new BadRequestException(messageHelper(message.E0013));
		}
		req.password = hashPassword(req.password);
		const newUser = new UserSchema(req);
		await databaseService.user.insertOne(newUser);
	}

	async login(req: loginRequest) {
		const user = await databaseService.user.findOne({ email: req.email });
		if (user && user.password === hashPassword(req.password)) {
			await databaseService.refreshToken.findOneAndDelete(
				{ userId: user._id },
				{ sort: { createdAt: 1 } }
			);

			const accessToken = await signToken({
				payload: {
					userId: user._id
				},
				options: {
					subject: user.email,
					algorithm: 'HS256',
					expiresIn: '7d'
				}
			});

			const refreshToken = await signToken({
				payload: {
					userId: user._id
				},
				options: {
					subject: user.email,
					algorithm: 'HS256',
					expiresIn: '7d'
				}
			});

			await databaseService.refreshToken.insertOne(
				new RefreshTokenSchema({
					userId: user._id,
					refreshToken,
					accessToken
				})
			);

			return {
				accessToken,
				refreshToken
			};
		}

		throw new BadRequestException(messageHelper(message.E0012));
	}

	async logout(accessToken: string) {
		const token = await databaseService.refreshToken.findOne({ accessToken });
		if (!token) {
			throw new ResourceNotFound(messageHelper(message.E0014, 'Token'));
		}
		await databaseService.refreshToken.deleteOne(token);
	}

	async getOauthGoogle(code: string) {
		const body = {
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: 'http://localhost:4000/api/oauth/google',
			grant_type: 'authorization_code'
		};

		const response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/xx-www-form-urlencoded'
			}
		});
		const data = await response.json();

		const user = await fetch(
			`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.access_token}&alt=json`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${data.id_token}`
				}
			}
		);
		return user.json();
	}
}

const authService = new AuthService();
export default authService;
