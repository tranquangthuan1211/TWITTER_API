export enum message {
	I0001 = 'Operation completed successfully.',
	I0002 = 'Operation completed successfully with errors.',
	I0003 = "You've been logged out!",
	I0004 = 'Created ${0} successfully.',
	I0005 = 'Update {0} success',
	I0006 = '${0} successful!',
	I0007 = 'Delete ${0} success.',

	E0012 = 'Invalid email or password!',
	E0013 = 'Email already used.',
	E0014 = '${0} is not found.',
	E0015 = 'Followed this user',
	E0016 = '${0} this tweet',
	E0019 = 'Validation Errors.'
}

const messageHelper = (message: string, ...args: string[]): string => {
	let result = message;
	args.forEach((arg, index) => {
		result = result.replace('${' + index + '}', arg);
	});
	return result;
};

export default messageHelper;
