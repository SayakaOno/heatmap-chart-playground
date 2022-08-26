export const getHeatMapColor = (numColors, colors, value) => {
	// https://www.andrewnoske.com/wiki/Code_-_heatmaps_and_color_gradients
	let idx1 = null; // |-- Our desired color will be between these two indexes in "color".
	let idx2 = null; // |
	let fractBetween = 0; // Fraction between "idx1" and "idx2" where our value is.

	if (value <= 0) {
		idx1 = idx2 = 0;
	} else if (value >= 1) {
		// accounts for an input <=0
		idx1 = idx2 = numColors - 1;
	} else {
		// accounts for an input >=0
		value = value * (numColors - 1); // Will multiply value by 3.
		idx1 = Math.floor(value); // Our desired color will be after this index.
		idx2 = idx1 + 1; // ... and before this index (inclusive).
		fractBetween = value - +idx1.toFixed(2); // Distance between the two indexes (0-1).
	}

	const r = (colors[idx2][0] - colors[idx1][0]) * fractBetween + colors[idx1][0];
	const g = (colors[idx2][1] - colors[idx1][1]) * fractBetween + colors[idx1][1];
	const b = (colors[idx2][2] - colors[idx1][2]) * fractBetween + colors[idx1][2];

	return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
};
