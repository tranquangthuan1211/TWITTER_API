import fileController from '@/controllers/file.controller';
import express from 'express';
const staticRouter = express.Router();

staticRouter.get('/image/:uri', fileController.getImage);

export default staticRouter;
