import e, { NextFunction, Request, Response } from 'express';
import { responseFail } from '../common/responseCommon';
import { BadRequestException } from '../exception/badRequest.exception';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ResourceNotFound } from '../exception/resourceNotFound';

export type fieldError = {
	field: string;
	message: string;
};

const handleErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof BadRequestException) {
		responseFail({ http: 400, message: err.message, res, errors: err.getErrors() });
	} else if (err instanceof ResourceNotFound) {
		responseFail({ http: 404, message: err.message, res });
	} else if (err instanceof JsonWebTokenError) {
		responseFail({ http: 401, message: err.message, res });
	} else {
		responseFail({ http: 500, message: err.message, res });
	}
};

export default handleErrors;
