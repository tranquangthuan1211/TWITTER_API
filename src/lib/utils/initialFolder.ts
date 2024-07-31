import fs from 'fs';
import path from 'path';
export const initialFolder = async (name: string) => {
	const uploadsFolder = path.resolve(name);
	if (!fs.existsSync(uploadsFolder)) {
		fs.mkdirSync(uploadsFolder, {
			recursive: true
		});
	}
};
