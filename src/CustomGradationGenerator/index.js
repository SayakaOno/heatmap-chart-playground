import React, { useState, useEffect, useMemo } from 'react';
import { InputNumber, Button } from 'antd';
import { initialColors } from '../gradationGridData';
import { getHeatMapColor } from '../utils';
import './gradation.css';

const CustomGradationGenerator = (props) => {
	const { colors, setColors } = props;
	const [gradientPointCount, setGradientPointCount] = useState(colors.length);

	const { setGetColor } = props;

	useEffect(
		() => {
			const newColors = [...colors];
			if (colors.length > gradientPointCount) {
				newColors.length = gradientPointCount;
			} else if (colors.length < gradientPointCount) {
				for (let i = 0; i < gradientPointCount - colors.length; i++) {
					newColors.push(colors[colors.length - 1]);
				}
			}
			setColors(newColors);
		},
		[gradientPointCount]
	);

	useEffect(
		() => {
			const func = (value) => {
				if (gradientPointCount === colors.length) {
					return getHeatMapColor(gradientPointCount, colors, value / 100);
				}
			};
			setGetColor(() => func);
		},
		[gradientPointCount, colors]
	);

	const onChangeColor = (e, index) => {
		const newColors = colors.slice();
		const color = e.target.value.split(',').map((num) => +num);
		newColors[index] = color;
		setColors(newColors);
	};

	const renderButton = () => {
		const onClick = () => {
			setGradientPointCount(initialColors.length);
			setColors(initialColors);
		};

		return (
			<div
				style={{
					textAlign: 'right',
					marginTop: 20,
					marginRight: 15
				}}
			>
				<Button onClick={onClick}>Reset</Button>
			</div>
		);
	};

	const colorInputs = useMemo(
		() => {
			const inputs = [];
			for (let i = gradientPointCount - 1; i >= 0; i--) {
				inputs.push(
					<div key={i} style={{ display: 'flex', marginBottom: 5 }}>
						<div
							className="gradation-demo__body__right__item"
							style={{
								backgroundColor: `rgb(${colors[i]})`
							}}
						>
							{i}
						</div>
						<span>rgb(</span>
						<input
							value={colors[i]}
							onChange={(e) => onChangeColor(e, i)}
							type="text"
							style={{ border: 'none', background: '#f1f1f1' }}
						/>
						<span>)</span>
					</div>
				);
			}
			return inputs;
		},
		[gradientPointCount, onChangeColor]
	);

	const onChangeInput = (input) => {
		if (input) {
			setGradientPointCount(input);
		}
	};

	return (
		<div className="gradation-demo">
			<div className="gradation-demo__body">
				<div className="gradation-demo__body__right">
					<div>Gradient points:</div>
					<InputNumber
						min={2}
						max={10}
						value={gradientPointCount}
						defaultValue={gradientPointCount}
						onChange={onChangeInput}
						style={{ marginBottom: 15 }}
					/>
					{colorInputs}
				</div>
			</div>
			{renderButton()}
		</div>
	);
};

export default CustomGradationGenerator;
