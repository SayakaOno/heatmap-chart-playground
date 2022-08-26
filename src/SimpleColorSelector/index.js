import React, { useState } from 'react';
import { InputNumber, Radio, Input, Checkbox } from 'antd';
import Palette from './Palette';
import 'antd/dist/antd.css';

const SimpleColorSelector = (props) => {

	const { setPressureRange, setInputMode, inputMode, mode, selectedColor, onSetSelectedColor, setHex, hex,rangeEnabled, setRangeEnabled } = props;

	return (
		<>
			<div><Checkbox checked={rangeEnabled} onChange={(e) => setRangeEnabled(e.target.checked)}/> Range:</div>
			<InputNumber min={3} max={10} defaultValue={3} onChange={setPressureRange} disabled={!rangeEnabled}/>
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
				<div style={{ margin: '15px 0 5px 0', width: 110, display: 'flex' }}>
					<Input onChange={(e) => setHex(e.target.value)} value={hex} />
					<span
						style={{
							display: 'inline-block',
							width: 50,
							backgroundColor: hex
						}}
					/>
				</div>
			)}
		</>
	);
};

export default SimpleColorSelector;
