import React from "react";
import "./date-range-picker.css";

interface DrpInputProps {
	dateStart?: Date;
	dateFinish?: Date;
	onPannelActivate?: () => void;
}

export function DrpInput({
	dateStart,
	dateFinish,
	onPannelActivate,
}: DrpInputProps) {
	return (
		<div
			className="drp-date-input"
			tabIndex={0}
			onClick={() => onPannelActivate && onPannelActivate()}
		>
			{dateStart?.toLocaleDateString()}-{dateFinish?.toLocaleDateString()}
		</div>
	);
}
