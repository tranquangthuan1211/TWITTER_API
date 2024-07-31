import express, { NextFunction, Request, Response } from 'express';
import route from './routes';
import databaseService from './services/database.service';
import handleErrors from './lib/handle';
import cors from 'cors';
import { config } from 'dotenv';
import { initialFolder } from './lib/utils/initialFolder';
config();
const app = express();
const PORT = process.env.PORT || 3000;

initialFolder('uploads');
app.use(cors());
app.use(express.json());
databaseService.connect();
route(app);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	handleErrors(err, req, res, next);
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
