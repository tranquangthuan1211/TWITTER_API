import { Express } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import fileRouter from './media.route';
import staticRouter from './static.route';
import tweetRouter from './tweet.route';
import bookmarkRouter from './bookmark.route';
import likeRouter from './like.route';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerOption from '@/lib/config/swagger';
import swaggerUi, { serveWithOptions } from 'swagger-ui-express';
import oauthRouter from './oauth.route';

const swaggerDocument = swaggerJSDoc(SwaggerOption);

const route = (app: Express) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	app.use('/api/auth', authRouter);
	app.use('/api/oauth', oauthRouter);
	app.use('/api/user', userRouter);
	app.use('/api/media', fileRouter);
	app.use('/api/tweet', tweetRouter);
	app.use('/api/bookmark', bookmarkRouter);
	app.use('/api/like', likeRouter);
	app.use('/static', staticRouter);

	app.use('/', (req, res) => {
		console.log('Welcome to Twitter API');
		res.status(200).json([
			{
				message: 'Welcome to Twitter API'
			},
			{
				message: 'Welcome to Twitter API'
			},
			{
				message: 'Welcome to Twitter API'
			}
		]);
	});
};

export default route;
