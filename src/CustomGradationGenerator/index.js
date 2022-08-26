import React, { useState } from 'react';
import GradationDemo from './GradationDemo';
import { initialColors } from '../gradationGridData';
import './gradation.css';

const CustomGradationGenerator = (props) => {
	const [colors, setColors] = useState(initialColors);
	const [number, setNumber] = useState(9);
	const [count, setCount] = useState(0);

	const { onDelete } = props;

	const getHeatMapColor = (value) => {
		// https://www.andrewnoske.com/wiki/Code_-_heatmaps_and_color_gradients
		let idx1 = null; // |-- Our desired color will be between these two indexes in "color".
		let idx2 = null; // |
		let fractBetween = 0; // Fraction between "idx1" and "idx2" where our value is.

		if (value <= 0) {
			idx1 = idx2 = 0;
		} else if (value >= 1) {
			// accounts for an input <=0
			idx1 = idx2 = number - 1;
		} else {
			// accounts for an input >=0
			value = value * (number - 1); // Will multiply value by 3.
			idx1 = Math.floor(value); // Our desired color will be after this index.
			idx2 = idx1 + 1; // ... and before this index (inclusive).
			fractBetween = value - +idx1.toFixed(2); // Distance between the two indexes (0-1).
		}

		const r = (colors[idx2][0] - colors[idx1][0]) * fractBetween + colors[idx1][0];
		const g = (colors[idx2][1] - colors[idx1][1]) * fractBetween + colors[idx1][1];
		const b = (colors[idx2][2] - colors[idx1][2]) * fractBetween + colors[idx1][2];

		return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
	};

	const renderGradation = () => {
		const values = [];
		for (let i = 0; i < 100; i++) {
			values.push(i * 0.01);
		}
		const gradation = values.map((value) => {
			return (
				<div
					style={{
						backgroundColor: getHeatMapColor(value),
						color: '#fff',
						content: '',
						width: 5,
						height: 30
					}}
				/>
			);
		});

		let labels = [];
		for (let i = 0; i < number; i++) {
			labels.push(i);
		}
		labels = labels.map((label) => {
			return <span>{label}</span>;
		});

		return (
			<div>
				<div style={{ display: 'flex' }}>{gradation}</div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>{labels}</div>
			</div>
		);
	};

	const onChangeColor = (e, index) => {
		const newColors = colors.slice();
		const color = e.target.value.split(',').map((num) => +num);
		newColors[index] = color;
		setColors(newColors);
	};

	const renderButton = () => {
		const text = initialColors ? 'Reset' : 'Delete';
		const onClick = initialColors ? () => setColors(initialColors) : onDelete;

		return (
			<div
				style={{
					textAlign: 'right',
					marginTop: 20,
					marginRight: 15
				}}
			>
				<button onClick={onClick}>{text}</button>
			</div>
		);
	};

	return (
		<div className="gradation-demo">
			<div className="gradation-demo__bar">{renderGradation()}</div>
			<div className="gradation-demo__body">
				<div className="gradation-demo__body__right">
					{colors.map((color, index) => {
						return (
							<div key={index} style={{ display: 'flex', marginBottom: 5 }}>
								<div
									className="gradation-demo__body__right__item"
									style={{
										backgroundColor: `rgb(${color})`
									}}
								>
									{index}
								</div>
								<span>rgb(</span>
								<input
									value={colors[index]}
									onChange={(e) => onChangeColor(e, index)}
									type="text"
									style={{ border: 'none', background: '#f1f1f1' }}
								/>
								<span>)</span>
							</div>
						);
					})}
				</div>
			</div>
			{renderButton()}
		</div>
	);
};

export default CustomGradationGenerator;
