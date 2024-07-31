import { responseSuccess } from '@/lib/common/responseCommon';
import messageHelper, { message } from '@/lib/message';
import fileService from '@/services/file.service';
import { NextFunction, Request, Response } from 'express';
import path from 'path';

class FileController {
	async uploadImage(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await fileService.uploadFileImage(req);
			responseSuccess({
				http: 200,
				message: messageHelper(message.I0006, 'Upload file'),
				data: data,
				res
			});
		} catch (error) {
			next(error);
		}
	}
	async getImage(req: Request, res: Response, next: NextFunction) {
		res.sendFile(path.resolve(`uploads/images/${req.params.uri}`));
	}
}

const fileController = new FileController();
export default fileController;
