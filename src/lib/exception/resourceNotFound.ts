import { fieldError } from '../handle';

export class ResourceNotFound extends Error {
	constructor(message: string, errors?: fieldError[]) {
		super(message);
	}
}
