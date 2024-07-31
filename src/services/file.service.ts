import { BadRequestException } from '@/lib/exception/badRequest.exception';
import { initialFolder } from '@/lib/utils/initialFolder';
import { ImageType } from '@/models/response/file.response';
import { config } from 'dotenv';
import { Request } from 'express';
import formidable from 'formidable';
import path from 'path';
config();

class FileService {
	async uploadFileImage(req: Request): Promise<ImageType[]> {
		initialFolder('uploads/images');
		const form = formidable({
			uploadDir: path.resolve('uploads/images'),
			maxFiles: 4,
			keepExtensions: true,
			maxFieldsSize: 10 * 1024 * 1024, // 10 MB
			filter: ({ name, originalFilename, mimetype }) => {
				const valid = name == 'image' && mimetype!.includes('image/');
				if (!valid) {
					form.emit('error' as any, new BadRequestException('File must be an image') as any);
				}
				return valid;
			}
		});

		return new Promise((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) {
					reject(err);
				}
				if (!files.image) {
					reject(new BadRequestException('File is required'));
				}
				const data: ImageType[] = files.image?.map((file: any) => {
					return {
						url: `${process.env.LOCALHOST}:${process.env.PORT}/static/image/${
							file.newFilename as string
						}`,
						originalFileName: file.originalFilename as string
					} as ImageType;
				}) as ImageType[];
				resolve(data);
			});
		});
	}
}

const fileService = new FileService();
export default fileService;
