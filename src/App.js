import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Switch, Button, Radio } from 'antd';
import 'antd/dist/antd.css';
import html2canvas from 'html2canvas';
import SimpleColorSelector from './SimpleColorSelector';
import CustomGradationGenerator from './CustomGradationGenerator';
import CustomGradation from './CustomGradationGenerator/CustomGradation';
import w3color, { hexs, colorNames } from './w3color';
import './App.css';

const mode = ['Color name', 'Hex'];

export const getRandomNumber = () => {
	return Math.floor(Math.random() * 101);
};

export const generatePressures = () => {
	let pressures = [];
	for (let i = 0; i < 240; i++) {
		pressures.push(getRandomNumber());
	}
	return pressures;
};

const App = () => {
	const [pressureRange, setPressureRange] = useState(3);
	const [selectedColor, setSelectedColor] = useState(colorNames[0]);
	const [showNumber, setShowNumber] = useState(false);
	const [pressures, setPressures] = useState([]);
	const [history, setHistory] = useState([]);
	const [inputMode, setInputMode] = useState(mode[0]);
	const [hex, setHex] = useState('#' + hexs[0]);
	const [version, setVersion] = useState(1);
	const [getColor, setGetColor] = useState(null);

	const w3colorObj = w3color()(inputMode === mode[0] ? selectedColor : hex);
	const hsl = w3colorObj.toHsl();

	useEffect(
		() => {
			setPressures(generatePressures());
		},
		[pressureRange]
	);

	useEffect(
		() => {
			if (version === 1) {
				const func = (pressure) => {
					return `hsl(${hsl.h}, ${hsl.s * 100}%, ${getLightness(getMappedPercentage(pressure))}%)`;
				};
				setGetColor(() => func);
			}
		},
		[version, hex]
	);

	const getLightness = (level) => {
		// 30(dark) - 90(light)
		return 100 - Math.floor(level * (60 / 100));
	};

	const colorSteps = useMemo(
		() => {
			const steps = [];
			for (let i = 1; i <= pressureRange; i++) {
				steps.push(100 * (i / pressureRange));
			}
			return steps;
		},
		[pressureRange]
	);

	const getMappedPercentage = (percentage) => {
		if ([0, 100].includes(percentage)) {
			return percentage;
		}
		for (let i = colorSteps.length - 2; i >= 0; i--) {
			const step = colorSteps[i];
			if (step < percentage) {
				return colorSteps[i + 1];
			}
		}
		return colorSteps[0];
	};

	const renderLegend = () => {
		let elems = [];
		for (let i = pressureRange; i > 0; i--) {
			elems.push(
				<div key={i}>
					<span
						style={{
							display: 'inline-block',
							width: 20,
							textAlign: 'right',
							marginRight: 3
						}}
					>
						{i}
					</span>
					<span
						style={{
							display: 'inline-block',
							width: 18,
							height: 18,
							border: 'solid 1px #111',
							background: getColor && getColor(100 * (i / pressureRange))
						}}
					/>
				</div>
			);
		}
		return elems;
	};

	const shot = async () => {
		html2canvas(document.querySelector('#capture'))
			.then((canvas) => {
				const imgData = canvas.toDataURL();
				return imgData;
			})
			.then((imgData) => {
				const newRecord = [...history, [`${selectedColor}-${pressureRange}`, imgData]];
				setHistory(newRecord);
			});
	};

	const onSetSelectedColor = (colorName, index) => {
		setSelectedColor(colorName);
		setHex('#' + hexs[index]);
	};

	const renderBody = () => {
		// if (version === 2) {
		// 	return <CustomGradation />;
		// }

		return (
			<Row style={{ padding: 20, height: 'calc(100vh - 40px)' }}>
				<Col span={5}>
					{version === 1 ? (
						<SimpleColorSelector
							setPressureRange={setPressureRange}
							setInputMode={setInputMode}
							inputMode={inputMode}
							mode={mode}
							selectedColor={selectedColor}
							onSetSelectedColor={onSetSelectedColor}
							setHex={setHex}
							hex={hex}
						/>
					) : (
						<CustomGradationGenerator setGetColor={setGetColor} />
					)}
				</Col>
				<Col span={9}>
					<h2>Sample</h2>
					<div id="capture" style={{ display: 'flex' }}>
						<div style={{ marginRight: 10, width: 41 }}>{renderLegend()}</div>
						<div
							style={{
								width: 401,
								height: 241,
								borderTop: 'solid 1px lightblue',
								borderLeft: 'solid 1px lightblue',
								marginBottom: 10
							}}
						>
							{pressures.map((pressure, index) => {
								return (
									<div
										key={index}
										style={{
											width: 20,
											height: 20,
											float: 'left',
											borderRight: 'solid 1px lightblue',
											borderBottom: 'solid 1px lightblue',
											background: getColor(pressure)
										}}
									>
										{showNumber && pressure}
									</div>
								);
							})}
						</div>
					</div>
					<div style={{ marginLeft: 46 }}>
						<Switch
							checked={showNumber}
							style={{ marginRight: 10 }}
							onChange={() => setShowNumber(!showNumber)}
						/>
						<span>Show numbers</span>
					</div>
					<Button onClick={shot} style={{ marginLeft: 350 }}>
						Screenshot
					</Button>
				</Col>
				<Col span={10} style={{ height: 'calc(100vh - 40px)', overflow: 'scroll' }}>
					{history.length ? (
						<div style={{ marginLeft: 30, marginBottom: 50 }}>
							<h2>History</h2>
							<div>
								{history.map((item, index) => {
									let attribute = item[0].split('-');
									return (
										<div key={index} style={{ float: 'left', width: '50%' }}>
											<div>
												Color: {attribute[0]}, Range: {attribute[1]}
											</div>
											<img src={item[1]} style={{ width: '100%' }} />
										</div>
									);
								})}
							</div>
						</div>
					) : null}
				</Col>
			</Row>
		);
	};

	return (
		<div>
			<Radio.Group onChange={(e) => setVersion(e.target.value)} value={version}>
				<Radio key={1} value={1}>
					Select colour
				</Radio>
				<Radio key={2} value={2}>
					Specify RGBs
				</Radio>
			</Radio.Group>
			{renderBody()}
		</div>
	);
};

export default App;
