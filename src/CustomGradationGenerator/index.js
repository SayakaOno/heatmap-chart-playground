import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { InputNumber, Button } from 'antd';
import { RgbColorPicker } from 'react-colorful';
import { initialColors } from '../gradationGridData';
import { getHeatMapColor } from '../utils';
import './gradation.css';

const CustomGradationGenerator = (props) => {
	const { colors, setColors, openedColorPicker, setOpenedColorPicker } = props;
	const [gradientPointCount, setGradientPointCount] = useState(colors.length);

	const { setGetColor } = props;

	useEffect(
		() => {
			setOpenedColorPicker(null);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[gradientPointCount, colors]
	);

	const onChangeColor = useCallback(
		(e, index) => {
			const newColors = colors.slice();
			const color = e.target.value.split(',').map((num) => +num);
			newColors[index] = color;
			setColors(newColors);
		},
		[colors, setColors]
	);

	const button = useMemo(
		() => {
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
		},
		[setColors]
	);

	const onSetOpenedColorPicker = useCallback(
		(index) => {
			let newOpenedColorPicker = null;
			if (index !== openedColorPicker) {
				newOpenedColorPicker = index;
			}
			setOpenedColorPicker(newOpenedColorPicker);
		},
		[openedColorPicker, setOpenedColorPicker]
	);

	const onPickColor = useCallback(
		({ r, g, b }, index) => {
			const newColors = colors.slice();
			newColors[index] = [r, g, b];
			setColors(newColors);
		},
		[colors, setColors]
	);

	const colorInputs = useMemo(
		() => {
			if (gradientPointCount !== colors.length) {
				return null;
			}

			const inputs = [];
			for (let i = gradientPointCount - 1; i >= 0; i--) {
				const [r, g, b] = colors[i];

				inputs.push(
					<div
						className="color-picker-trigger"
						key={i}
						style={{ display: 'flex', marginBottom: 5, cursor: 'pointer', position: 'relative' }}
						onClick={() => onSetOpenedColorPicker(i)}
					>
						{openedColorPicker === i && (
							<RgbColorPicker color={{ r, g, b }} onChange={(rgb) => onPickColor(rgb, i)} />
						)}
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
		[gradientPointCount, onChangeColor, colors, onPickColor, onSetOpenedColorPicker, openedColorPicker]
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
						style={{ marginBottom: 20 }}
					/>
					{colorInputs}
				</div>
			</div>
			{button}
		</div>
	);
};

export default CustomGradationGenerator;
