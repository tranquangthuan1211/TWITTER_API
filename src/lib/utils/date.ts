const formatDateToMonthAndYear = (date: Date): string => {
	const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
	return new Intl.DateTimeFormat('en-US', options).format(date);
};

const getTimeAgoPost = (date: Date): string => {
	let currentDate = new Date();
	let difference = currentDate.getTime() - date.getTime();
	let differenceInSeconds = Math.floor(difference / 1000);

	let differenceInMinutes = Math.floor(differenceInSeconds / 60);

	let differenceInHours = Math.floor(differenceInMinutes / 60);

	let differenceInDays = Math.floor(differenceInHours / 24);

	if (differenceInDays > 0) {
		return `${differenceInDays}d ago`;
	} else if (differenceInHours > 0) {
		return `${differenceInHours}h ago`;
	} else if (differenceInMinutes > 0) {
		return `${differenceInMinutes}m ago`;
	} else {
		return `${differenceInSeconds}s ago`;
	}
};

export { formatDateToMonthAndYear, getTimeAgoPost };
