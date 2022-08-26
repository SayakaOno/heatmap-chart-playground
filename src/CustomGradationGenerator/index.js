import React, { useState, useEffect } from 'react';
import { initialColors } from '../gradationGridData';
import { getHeatMapColor } from '../utils';
import './gradation.css';

const CustomGradationGenerator = (props) => {
	const [colors, setColors] = useState(initialColors);
	const [number, setNumber] = useState(9);
	const [count, setCount] = useState(0);

	const { onDelete, setGetColor } = props;

	useEffect(
		() => {
			const func = (value) => {
				return getHeatMapColor(number, colors, value / 100);
			};
			setGetColor(() => func);
		},
		[number, colors]
	);

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
