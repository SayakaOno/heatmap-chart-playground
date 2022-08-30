import React, { useState, useRef, useEffect } from 'react';
import { InputNumber, Radio, Input, Checkbox } from 'antd';
import { HexColorPicker } from 'react-colorful';
import Palette from './Palette';
import 'antd/dist/antd.css';
import './simpleColorSelector.css';

const SimpleColorSelector = (props) => {
	const [colorPickerOpened, setColorPickerOpened] = useState(false);

	const colorPickerOpenedRef = useRef(null);

	const {
		setDataRange,
		setInputMode,
		inputMode,
		mode,
		selectedColor,
		onSetSelectedColor,
		setHex,
		hex,
		rangeEnabled,
		setRangeEnabled
	} = props;

	useEffect(
		() => {
			colorPickerOpenedRef.current = colorPickerOpened;
		},
		[colorPickerOpened]
	);

	const closeOpenedColorPicker = (e) => {
		if (colorPickerOpenedRef.current !== null && e.target.className !== 'color-picker-trigger') {
			setColorPickerOpened(null);
		}
	};

	useEffect(() => {
		window.addEventListener('click', closeOpenedColorPicker);

		return () => window.removeEventListener('click', closeOpenedColorPicker);
	}, []);

	return (
		<div className="simple-color-selector">
			<div>
				<Checkbox checked={rangeEnabled} onChange={(e) => setRangeEnabled(e.target.checked)} /> Range:
			</div>
			<InputNumber min={3} max={10} defaultValue={3} onChange={setDataRange} disabled={!rangeEnabled} />
			<div style={{ margin: '15px 0 5px 0' }}>
				<Radio.Group onChange={(e) => setInputMode(e.target.value)} value={inputMode}>
					{mode.map((mode) => {
						return (
							<Radio key={mode} value={mode}>
								{mode}
							</Radio>
						);
					})}
				</Radio.Group>
			</div>

			{inputMode === mode[0] ? (
				<Palette selectedColor={selectedColor} setSelectedColor={onSetSelectedColor} />
			) : (
				<div
					style={{
						margin: '15px 0 5px 0',
						width: 150,
						display: 'flex',
						position: 'relative',
						cursor: 'pointer'
					}}
					onClick={() => setColorPickerOpened(!colorPickerOpened)}
				>
					{colorPickerOpened && <HexColorPicker color={hex} onChange={setHex} />}
					<span
						style={{
							display: 'inline-block',
							width: 50,
							backgroundColor: hex
						}}
					/>
					<Input onChange={(e) => setHex(e.target.value)} value={hex} />
				</div>
			)}
		</div>
	);
};

export default SimpleColorSelector;
