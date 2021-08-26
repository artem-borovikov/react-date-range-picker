export function getPannelDateArray(pivotDate: Date = new Date()): Date[][] {
	const DAYS_IN_PANNEL = 42;

	const lastMonth = new Date(pivotDate.getFullYear(), pivotDate.getMonth(), 0);
	let pannelDate = new Date(
		pivotDate.getFullYear(),
		pivotDate.getMonth(),
		1,
		0,
		0,
		0,
	);

	pannelDate = new Date(
		lastMonth.getFullYear(),
		lastMonth.getMonth(),
		pannelDate.getDay() === 1
			? lastMonth.getDate() - 6
			: lastMonth.getDate() - (pannelDate.getDay() || 7) + 2,
	);

	const pannel: Date[][] = [[]];

	for (
		let i = 0, col = 0, row = 0;
		i < DAYS_IN_PANNEL;
		i++,
			col++,
			pannelDate = new Date(
				pannelDate.getFullYear(),
				pannelDate.getMonth(),
				pannelDate.getDate() + 1,
				pannelDate.getHours(),
				pannelDate.getMinutes(),
				pannelDate.getSeconds(),
			)
	) {
		if (i > 0 && col % 7 === 0) {
			pannel.push([]);
			col = 0;
			row++;
		}

		pannel[row][col] = pannelDate;
	}

	return pannel;
}
