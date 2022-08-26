import React from 'react';
import { generatePressures } from './../App';
import { getHeatMapColor } from '../utils';
import './gradation.css';

const GradationDemo = (props) => {
	const { numColors, initialColors, colors, setColors, onDelete } = props;

	const renderGradation = () => {
		const values = [];
		for (let i = 0; i < 100; i++) {
			values.push(i * 0.01);
		}
		const gradation = values.map((value) => {
			return (
				<div
					style={{
						backgroundColor: getHeatMapColor(numColors, colors, value),
						color: '#fff',
						content: '',
						width: 5,
						height: 30
					}}
				/>
			);
		});

		let labels = [];
		for (let i = 0; i < numColors; i++) {
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

	const renderGrid = () => {
		return generatePressures().map((pressure) => {
			return (
				<div
					style={{
						backgroundColor: getHeatMapColor(numColors, colors, pressure / 100),
						color: '#fff',
						content: '',
						width: 14,
						height: 10,
						border: 'solid 1px rgb(232, 232, 232)'
					}}
				/>
			);
		});
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
				<div className="gradation-demo__body__left">
					<div className="grid">{renderGrid()}</div>
				</div>
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

export default GradationDemo;
