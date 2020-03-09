import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { colorNames } from './w3color';

const Palette = props => {
  return (
    <>
      <div style={{ margin: '15px 0 5px 0' }}>Color:</div>
      <ul style={{ width: 200, margin: 0, padding: 0 }}>
        {colorNames.map(color => {
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
