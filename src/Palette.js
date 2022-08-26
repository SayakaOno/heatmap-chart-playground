import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Checkbox, Tooltip } from 'antd';
import './App.css';
import { colorNames, usedColors } from './w3color';

const disableUsedColor = true;

const Palette = props => {
  const [filtered, setFiltered] = useState(true);
  const colors = !disableUsedColor && filtered
    ? colorNames.filter(color => usedColors.includes(color))
    : colorNames;

  const selectColorWithKey = e => {
    const index = colors.indexOf(props.selectedColor);
    if (e.keyCode === 39 && index !== colors.length - 1) {
      props.setSelectedColor(colors[index + 1]);
    } else if (e.keyCode === 37 && !(index < 1)) {
      props.setSelectedColor(colors[index - 1]);
    }
  };

  return (
    <>
      <div style={{ margin: '15px 0 5px 0' }}>
        Color: <b>{props.selectedColor}</b>
      </div>
      {!disableUsedColor &&
        <div>
          <Checkbox checked={filtered} onChange={() => setFiltered(!filtered)} />
          <span>used colors</span>
        </div>
      }
      <ul className="palette" style={{ width: 200, margin: 0, padding: 0 }}>
        {colors.map((color, index) => {
          return (
            <Tooltip title={color} key={color}>
              <li
                tabIndex={index + 1}
                key={color}
                onClick={() => props.setSelectedColor(color, index)}
                onFocus={() => props.setSelectedColor(color, index)}
                onKeyDown={e => selectColorWithKey(e)}
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
              />
            </Tooltip>
          );
        })}
      </ul>
    </>
  );
};

export default Palette;
