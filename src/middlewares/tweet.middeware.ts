import { BadRequestException } from '@/lib/exception/badRequest.exception';
import { validate } from '@/lib/utils/validate';
import { checkSchema } from 'express-validator';

export const getTweetPageValidator = validate(
	checkSchema({
		limit: {
			in: ['query'],
			isNumeric: true,
			optional: true,
			custom: {
				options: async (value, { req }) => {
					const num = Number(value);
					if (num < 1 || num > 100) {
						throw new BadRequestException('Limit must be between 1 and 100');
					}
					return true;
				}
			}
		},
		page: {
			in: ['query'],
			optional: true,
			isNumeric: true
		}
	})
);
