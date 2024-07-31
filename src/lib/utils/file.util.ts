export const getFileWithNoExtension = (filePath: string): string => {
	const dot = filePath.lastIndexOf('.');
	return filePath.substring(0, dot);
};

export const getFileExtension = (filePath: string): string => {
	const dot = filePath.lastIndexOf('.');
	return filePath.substring(dot + 1);
};
