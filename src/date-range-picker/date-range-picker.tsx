import { getPannelDateArray } from "./date-range-picker-utils";
import React from "react";
import { DrpInput } from "./drp-input";
import "./date-range-picker.css";

const MONTHS = [
	"январь",
	"февраль",
	"март",
	"апрель",
	"май",
	"июнь",
	"июль",
	"август",
	"сентябрь",
	"октябрь",
	"ноябрь",
	"декабрь",
];

const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

type DateState = [Date | undefined, Date | undefined];

interface DateRangePickerProps {
	minDate?: Date | undefined;
	maxDate?: Date | undefined;
	dateStart?: Date | undefined;
	dateFinish?: Date | undefined;
	onChange?: (dates: DateState) => void;
	monthCount?: number;
}

export function DateRangePicker({
	maxDate,
	minDate,
	onChange,
	dateStart = new Date(),
	dateFinish,
	monthCount = 2,
}: DateRangePickerProps) {
	const initialDates: DateState = [
		new Date(
			dateStart.getFullYear(),
			dateStart.getMonth(),
			dateStart.getDate(),
			0,
			0,
		),
		dateFinish
			? new Date(
					dateFinish.getFullYear(),
					dateFinish.getMonth(),
					dateFinish.getDate(),
					0,
					0,
			  )
			: undefined,
	];

	const [dates, setDates] = React.useState<DateState>(initialDates);

	const [pivotDate, setPivotDate] = React.useState(dateStart);
	const [isPannelActive, setPannelActive] = React.useState(false);
	const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>(
		undefined,
	);

	const months = Array.from({
		length: monthCount,
	}).map((_, idx) => {
		return getPannelDateArray(
			new Date(
				pivotDate.getFullYear(),
				pivotDate.getMonth() + idx,
				pivotDate.getDate(),
				0,
				0,
			),
		);
	});

	return (
		<>
			<div className="drp-container">
				<DrpInput
					dateFinish={dates[1]}
					dateStart={dates[0]}
					onPannelActivate={() => setPannelActive(!isPannelActive)}
				/>

				{isPannelActive && (
					<div className="drp-pannel-container">
						<div className="drp-pannel">
							{months.map((pannel, idx) => {
								const month = new Date(
									pivotDate.getFullYear(),
									pivotDate.getMonth() + idx,
									pivotDate.getDate(),
								);

								return (
									<div key={idx} className="drp-pannel-month">
										<div className="drp-month-control">
											{idx === 0 && (
												<div
													className="drp-arrow-container"
													onClick={() => {
														setPivotDate(
															new Date(
																pivotDate.getFullYear(),
																pivotDate.getMonth() - 1,
																pivotDate.getDate(),
															),
														);
													}}
												>
													<i className="drp-arrow drp-arrow-left"></i>
												</div>
											)}

											<label className="drp-month-label">
												{MONTHS[month.getMonth()]}
												&nbsp;{month.getFullYear()}
											</label>

											{idx === months.length - 1 && (
												<div
													className="drp-arrow-container"
													onClick={() => {
														setPivotDate(
															new Date(
																pivotDate.getFullYear(),
																pivotDate.getMonth() + 1,
																pivotDate.getDate(),
															),
														);
													}}
												>
													<i className="drp-arrow drp-arrow-right"></i>
												</div>
											)}
										</div>

										<table>
											<thead>
												<tr>
													{WEEKDAYS.map((weekday) => (
														<th key={weekday} className="drp-weekday-label">
															{weekday}
														</th>
													))}
												</tr>
											</thead>

											<tbody>
												{pannel.map((row) => {
													return (
														<tr key={row[0]?.toISOString() + "-row-" + idx}>
															{row.map((cell) => {
																let className = "drp-pannel-cell";

																if (cell?.getMonth() !== month.getMonth()) {
																	className += " drp-pannel-cell-disabled";
																}

																if (
																	dates
																		.map((date) => date?.getTime())
																		.includes(cell?.getTime()) &&
																	cell?.getMonth() === month.getMonth()
																) {
																	className += " drp-pannel-cell-active";
																}

																if (
																	(dates[0] &&
																		cell &&
																		dates[1] &&
																		cell > dates[0] &&
																		cell < dates[1] &&
																		cell.getMonth() === month.getMonth()) ||
																	(hoveredDate &&
																		dates[0] &&
																		!dates[1] &&
																		cell &&
																		cell < hoveredDate &&
																		cell > dates[0])
																) {
																	className += " drp-pannel-cell-selected";
																}

																return (
																	<td
																		className={className}
																		key={cell?.toISOString() + "-cell-" + idx}
																		onMouseMove={() => {
																			if (dates[0]) {
																				setHoveredDate(cell);
																			}
																		}}
																		onClick={() => {
																			const [oldDateStart, oldDateFinish] =
																				dates;

																			if (!oldDateStart)
																				return setDates([cell, undefined]);

																			if (oldDateStart && oldDateFinish) {
																				return setDates([cell, undefined]);
																			}

																			if (
																				!oldDateFinish &&
																				cell &&
																				cell > oldDateStart
																			) {
																				return setDates([oldDateStart, cell]);
																			}

																			if (
																				oldDateStart &&
																				cell &&
																				cell < oldDateStart
																			) {
																				return setDates([cell, undefined]);
																			}
																		}}
																	>
																		{cell && cell.getDate() > 9
																			? cell.getDate()
																			: "0" + cell?.getDate()}
																	</td>
																);
															})}
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								);
							})}
						</div>

						<div className="drp-controls">
							<button
								className="drp-btn"
								onClick={() => {
									setDates(initialDates);
									setPannelActive(false);
									setPivotDate(dateStart);
								}}
							>
								Отменить
							</button>
							<button
								disabled={!dates[0] || !dates[1]}
								className="drp-btn drp-btn-apply"
								onClick={() => {
									onChange && onChange(dates);
									setPannelActive(false);
								}}
							>
								Применить
							</button>
						</div>
					</div>
				)}
			</div>
			<p>Lorem Ipsum</p>
		</>
	);
}
