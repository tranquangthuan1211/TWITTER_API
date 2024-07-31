import fileController from '@/controllers/file.controller';
import express from 'express';
const fileRouter = express.Router();

fileRouter.post('/image', fileController.uploadImage);
// fileRouter.post('/images', fileController.upload.array('images', 4));
export default fileRouter;
