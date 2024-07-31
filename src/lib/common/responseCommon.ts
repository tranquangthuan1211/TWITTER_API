import { Response } from 'express';
import { fieldError } from '../handle';

type responseType = {
	isSuccess: boolean;
	message: string;
	data?: Object;
	errors?: fieldError[];
};

const responseSuccess = ({
	http,
	message,
	data,
	res
}: {
	http: number;
	message: string;
	data?: Object;
	res: Response;
}) => {
	response({ http, message, data, res });
};

const responseFail = ({
	http,
	message,
	errors,
	res
}: {
	http: number;
	message: string;
	errors?: fieldError[];
	res: Response;
}) => {
	response({ http, message, errors, res });
};

const response = ({
	http,
	message,
	data,
	errors,
	res
}: {
	http: number;
	message: string;
	data?: Object;
	errors?: fieldError[];
	res: Response;
}) => {
	let response: responseType = {
		isSuccess: http >= 200 && http < 300,
		message
	};
	response.data = data || {};
	response.errors = errors || [];
	res.status(http).json(response);
};

export { responseSuccess, responseFail };
