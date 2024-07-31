import { fieldError } from '../handle';

export class BadRequestException extends Error {
	private errors?: fieldError[];

	constructor(message: string, errors?: fieldError[]) {
		super(message);
		this.errors = errors;
	}

	getErrors() {
		return this.errors;
	}
}
