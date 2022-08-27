import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Row, Col, Switch, Button, Radio, Tooltip } from 'antd';
import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import html2canvas from 'html2canvas';
import SimpleColorSelector from './SimpleColorSelector';
import CustomGradationGenerator from './CustomGradationGenerator';
import w3color, { hexs, colorNames } from './w3color';
import { initialColors } from './gradationGridData';
import './App.css';

const mode = ['Color name', 'Hex'];

const getRandomNumber = () => {
	return Math.floor(Math.random() * 101);
};

const generatePressures = () => {
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
	const [rangeEnabled, setRangeEnabled] = useState(false);
	const [customGradationColors, setCustomGradationColors] = useState(initialColors);
	const [openedColorPicker, setOpenedColorPicker] = useState(null);

	const w3colorObj = w3color()(inputMode === mode[0] ? selectedColor : hex);
	const hsl = w3colorObj.toHsl();

	const openedColorPickerRef = useRef();

	useEffect(
		() => {
			openedColorPickerRef.current = openedColorPicker;
		},
		[openedColorPicker]
	);

	const closeOpenedColorPicker = (e) => {
		if (openedColorPickerRef.current !== null && e.target.className !== 'color-picker-trigger') {
			setOpenedColorPicker(null);
		}
	};

	useEffect(() => {
		setPressures(generatePressures());
		window.addEventListener('click', closeOpenedColorPicker);

		return () => window.removeEventListener('click', closeOpenedColorPicker);
	}, []);

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

	useEffect(
		() => {
			if (version === 1) {
				const func = (percentage, shouldMap) => {
					const usedPercentage = shouldMap ? getMappedPercentage(percentage) : percentage;
					return `hsl(${hsl.h}, ${hsl.s * 100}%, ${getLightness(usedPercentage)}%)`;
				};
				setGetColor(() => func);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[version, hex, colorSteps]
	);

	const getLightness = (level) => {
		// 30(dark) - 90(light)
		return 100 - Math.floor(level * (60 / 100));
	};

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

	const legend = useMemo(
		() => {
			if (version === 1 && rangeEnabled) {
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
			} else {
				const values = [];
				for (let i = 1; i <= 100; i++) {
					values.push(100 - i);
				}

				return (
					<div style={{ float: 'right' }}>
						{values.map((value, index) => {
							return (
								<div
									key={index}
									style={{
										backgroundColor: getColor && getColor(value),
										color: '#fff',
										content: '',
										width: 18,
										height: 240 / values.length
									}}
								/>
							);
						})}
					</div>
				);
			}
		},
		[version, rangeEnabled, getColor, pressureRange]
	);

	const capture = useCallback(
		async () => {
			html2canvas(document.querySelector('#capture'))
				.then((canvas) => {
					const imgData = canvas.toDataURL();
					return imgData;
				})
				.then((imgData) => {
					let colorInfo = 'Color: ';
					if (version === 1) {
						if (inputMode === mode[0]) {
							colorInfo += selectedColor;
						} else {
							colorInfo += hex;
						}

						if (rangeEnabled) {
							colorInfo += `, Range: ${pressureRange}`;
						}
					} else {
						const rgbs = customGradationColors.slice().reverse().map(([r, g, b], index) => {
							return (
								<div key={index}>
									[{r}, {g}, {b}]
								</div>
							);
						});
						colorInfo = (
							<div>
								<span>Color </span>
								<Tooltip title={rgbs}>
									<InfoCircleOutlined />
								</Tooltip>
							</div>
						);
					}
					const newRecord = [...history, [colorInfo, imgData]];
					setHistory(newRecord);
				});
		},
		[customGradationColors, hex, history, inputMode, pressureRange, rangeEnabled, selectedColor, version]
	);

	const onSetSelectedColor = (colorName, index) => {
		setSelectedColor(colorName);
		setHex('#' + hexs[index]);
	};

	const body = useMemo(
		() => {
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
								rangeEnabled={rangeEnabled}
								setRangeEnabled={setRangeEnabled}
							/>
						) : (
							<CustomGradationGenerator
								setGetColor={setGetColor}
								colors={customGradationColors}
								setColors={setCustomGradationColors}
								openedColorPicker={openedColorPicker}
								setOpenedColorPicker={setOpenedColorPicker}
							/>
						)}
					</Col>
					<Col span={9}>
						<h2>
							Sample{' '}
							<button
								title="Re-generate heatmap data"
								onClick={() => setPressures(generatePressures())}
								style={{ background: 'transparent', border: 'transparent', cursor: 'pointer' }}
							>
								<RedoOutlined />
							</button>
						</h2>
						<div id="capture" style={{ display: 'flex' }}>
							<div style={{ marginRight: 10, width: 41 }}>{legend}</div>
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
												background: getColor(pressure, rangeEnabled)
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
						<Button onClick={capture} style={{ marginLeft: 350 }}>
							Capture
						</Button>
					</Col>
					<Col span={10} style={{ height: 'calc(100vh - 40px)', overflow: 'scroll' }}>
						{history.length ? (
							<div style={{ marginLeft: 30, marginBottom: 50 }}>
								<h2>History</h2>
								<div>
									{history.map((item, index) => {
										return (
											<div key={index} style={{ float: 'left', width: '50%' }}>
												<div>{item[0]}</div>
												<img src={item[1]} style={{ width: '100%' }} alt="" />
											</div>
										);
									})}
								</div>
							</div>
						) : null}
					</Col>
				</Row>
			);
		},
		[
			capture,
			customGradationColors,
			getColor,
			hex,
			history,
			inputMode,
			legend,
			openedColorPicker,
			pressures,
			rangeEnabled,
			selectedColor,
			showNumber,
			version
		]
	);

	return (
		<div style={{ minWidth: 1250, margin: 15 }}>
			<Radio.Group onChange={(e) => setVersion(e.target.value)} value={version}>
				<Radio key={1} value={1}>
					Select colour
				</Radio>
				<Radio key={2} value={2}>
					Specify RGBs
				</Radio>
			</Radio.Group>
			{body}
		</div>
	);
};

export default App;
