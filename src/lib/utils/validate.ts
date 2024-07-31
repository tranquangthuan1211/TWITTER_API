import { NextFunction, Request, Response } from 'express';
import { ValidationChain, ValidationError, validationResult } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema';
import { BadRequestException } from '../exception/badRequest.exception';
import { fieldError } from '../handle';
import messageHelper, { message } from '../message';

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		await validation.run(req);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			next(
				new BadRequestException(messageHelper(message.E0019), validationErrors(errors.mapped()))
			);
		}
		next();
	};
};

const validationErrors = (errors: Record<string, ValidationError>): fieldError[] => {
	return Object.entries(errors).map(([key, value]) => {
		return { field: key, message: value.msg };
	});
};
