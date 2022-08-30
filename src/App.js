import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Row, Col, Switch, Button, Radio, Tooltip } from 'antd';
import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import html2canvas from 'html2canvas';
import SimpleColorSelector from './SimpleColorSelector';
import CustomGradationGenerator from './CustomGradationGenerator';
import w3color, { hexs, colorNames } from './w3color';
import { initialColors } from './gradationGridData';

const mode = ['Color name', 'Hex'];

const LEGEND_WIDTH = 51;

const getRandomNumber = () => {
	return Math.floor(Math.random() * 101);
};

const generateHeatmapData = () => {
	let data = [];
	for (let i = 0; i < 240; i++) {
		data.push(getRandomNumber());
	}
	return data;
};

const App = () => {
	const [dataRange, setDataRange] = useState(3);
	const [selectedColor, setSelectedColor] = useState(colorNames[0]);
	const [showNumber, setShowNumber] = useState(false);
	const [data, setData] = useState([]);
	const [history, setHistory] = useState([]);
	const [inputMode, setInputMode] = useState(mode[0]);
	const [hex, setHex] = useState('#' + hexs[0]);
	const [version, setVersion] = useState(1);
	const [getColor, setGetColor] = useState(null);
	const [rangeEnabled, setRangeEnabled] = useState(false);
	const [customGradationColors, setCustomGradationColors] = useState(initialColors);
	const [cellWidth, setCellWidth] = useState(null);

	const sampleGridRef = useRef(null);

	const w3colorObj = w3color()(inputMode === mode[0] ? selectedColor : hex);
	const hsl = w3colorObj.toHsl();

	const onSetCellWidth = () => {
		const containerWidth = Math.min(sampleGridRef.current.offsetWidth - LEGEND_WIDTH - 2, 441);
		setCellWidth(Math.floor(containerWidth / 20));
	};

	useEffect(() => {
		setData(generateHeatmapData());
		onSetCellWidth();

		window.addEventListener('resize', onSetCellWidth);

		return () => window.removeEventListener('resize', onSetCellWidth);
	}, []);

	const colorSteps = useMemo(
		() => {
			const steps = [];
			for (let i = 1; i <= dataRange; i++) {
				steps.push(100 * (i / dataRange));
			}
			return steps;
		},
		[dataRange]
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
				for (let i = dataRange; i > 0; i--) {
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
									background: getColor && getColor(100 * (i / dataRange))
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
										height: cellWidth * 12 / values.length
									}}
								/>
							);
						})}
					</div>
				);
			}
		},
		[version, rangeEnabled, getColor, dataRange, cellWidth]
	);

	const capture = useCallback(
		async () => {
			const pageYOffset = window.pageYOffset;
			window.scrollTo(0, 0);

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
							colorInfo += `, Range: ${dataRange}`;
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

					window.scrollTo(0, pageYOffset);
				});
		},
		[customGradationColors, hex, history, inputMode, dataRange, rangeEnabled, selectedColor, version]
	);

	const onSetSelectedColor = (colorName, index) => {
		setSelectedColor(colorName);
		setHex('#' + hexs[index]);
	};

	const body = useMemo(
		() => {
			return (
				<Row style={{ padding: '20px 0 0 20px', height: 'calc(100vh - 60px)' }}>
					<Col xl={5} lg={5} md={8} xs={24} style={{ marginBottom: 20 }}>
						{version === 1 ? (
							<SimpleColorSelector
								setDataRange={setDataRange}
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
							/>
						)}
					</Col>
					<Col xl={9} lg={11} md={16} xs={24} style={{ marginBottom: 20 }}>
						<h2>
							Sample{' '}
							<button
								title="Re-generate heatmap data"
								onClick={() => setData(generateHeatmapData())}
								style={{ background: 'transparent', border: 'transparent', cursor: 'pointer' }}
							>
								<RedoOutlined />
							</button>
						</h2>
						<div
							ref={sampleGridRef}
							id="capture"
							style={{
								display: 'flex'
							}}
						>
							<div style={{ marginRight: 10, width: 41 }}>{legend}</div>
							<div
								style={{
									maxWidth: 441,
									width: cellWidth * 20 + 1,
									borderTop: 'solid 1px lightblue',
									borderLeft: 'solid 1px lightblue',
									marginBottom: 10
								}}
							>
								{data.map((value, index) => {
									return (
										<div
											key={index}
											style={{
												width: cellWidth,
												height: cellWidth,
												float: 'left',
												borderRight: 'solid 1px lightblue',
												borderBottom: 'solid 1px lightblue',
												background: getColor(value, rangeEnabled)
											}}
										>
											{showNumber && value}
										</div>
									);
								})}
							</div>
						</div>
						<div style={{ marginLeft: 46, maxWidth: 451 }}>
							<Switch
								checked={showNumber}
								style={{ marginRight: 10 }}
								onChange={() => setShowNumber(!showNumber)}
							/>
							<span>Show numbers</span>
							<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
								<Button onClick={capture}>Capture</Button>
							</div>
						</div>
					</Col>
					<Col xl={10} lg={8} md={24} xs={24}>
						{history.length ? (
							<div style={{ marginLeft: 30 }}>
								<h2>History</h2>
								<div
									style={{
										maxHeight: 'calc(100vh - 110px)',
										overflow: 'scroll'
									}}
								>
									<div
										style={{
											display: 'flex',
											flexWrap: 'wrap'
										}}
									>
										{history.map((item, index) => {
											return (
												<div
													key={index}
													style={{
														width: 230,
														marginRight: 10,
														marginBottom: 10
													}}
												>
													<div>{item[0]}</div>
													<img src={item[1]} style={{ width: '100%' }} alt="" />
												</div>
											);
										})}
									</div>
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
			data,
			rangeEnabled,
			selectedColor,
			showNumber,
			version,
			cellWidth
		]
	);

	return (
		<div style={{ padding: 15 }}>
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
