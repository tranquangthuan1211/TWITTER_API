import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const signToken = ({
	payload,
	secret = process.env.SECRET_KEY as string,
	options = {
		algorithm: 'HS256'
	}
}: {
	payload: any;
	secret?: string;
	options?: jwt.SignOptions;
}) => {
	return new Promise<string>((resolve, reject) => {
		jwt.sign(payload, secret, options, (err, token) => {
			if (err) {
				throw reject(err);
			}
			resolve(token as string);
		});
	});
};

const verifyToken = ({
	token,
	secret = process.env.SECRET_KEY as string
}: {
	token: string;
	secret?: string;
}) => {
	return new Promise<jwt.JwtPayload>((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				throw reject(err);
			}
			resolve(decoded as jwt.JwtPayload);
		});
	});
};

export { signToken, verifyToken };
