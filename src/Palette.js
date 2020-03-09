import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Checkbox } from 'antd';
import './App.css';
import { colorNames, usedColors } from './w3color';

const Palette = props => {
  const [filtered, setFiltered] = useState(true);
  const colors = filtered
    ? colorNames.filter(color => usedColors.includes(color))
    : colorNames;
  return (
    <>
      <div style={{ margin: '15px 0 5px 0' }}>
        Color: <b>{props.selectedColor}</b>
      </div>
      <Checkbox checked={filtered} onChange={() => setFiltered(!filtered)} />{' '}
      used colors
      <ul style={{ width: 200, margin: 0, padding: 0 }}>
        {colors.map(color => {
          return (
            <li
              key={color}
              onClick={() => props.setSelectedColor(color)}
              style={{
                width: 18,
                height: 18,
                background: color,
                border: `solid 1px ${
                  props.selectedColor === color ? '#000' : color
                }`,
                listStyle: 'none',
                display: 'inline-block',
                cursor: 'pointer'
              }}
            ></li>
          );
        })}
      </ul>
    </>
  );
};

export default Palette;
