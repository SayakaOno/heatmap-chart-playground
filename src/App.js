import React, { useState, useEffect } from 'react';
import { Row, Col, InputNumber, Switch } from 'antd';
import 'antd/dist/antd.css';
import Palette from './Palette';
import './App.css';
import w3color, { colorNames } from './w3color';

const App = () => {
  const [pressureRange, setPressureRange] = useState(3);
  const [selectedColor, setSelectedColor] = useState(colorNames[2]);
  const [showNumber, setShowNumber] = useState(false);
  const [pressures, setPressures] = useState([]);
  const w3colorObj = w3color()(selectedColor);
  const hsl = w3colorObj.toHsl();

  useEffect(() => {
    setPressures(generatePressures());
  }, [pressureRange]);

  const randomNumber = () => {
    return Math.floor(Math.random() * (pressureRange + 1));
  };

  const generatePressures = () => {
    let pressures = [];
    for (let i = 0; i < 240; i++) {
      pressures.push(randomNumber());
    }
    return pressures;
  };

  const getLightness = level => {
    const levelOutOf100 = (level / pressureRange) * 100;
    // 20(dark) - 90(light)
    return 100 - Math.floor(levelOutOf100 * (70 / 100));
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
              background: `hsl(${hsl.h}, ${hsl.s * 100}%, ${getLightness(i)}%)`
            }}
          />
        </div>
      );
    }
    return elems;
  };

  return (
    <Row style={{ padding: 20 }}>
      <Col span={5}>
        <div>Range:</div>
        <InputNumber
          min={3}
          max={10}
          defaultValue={3}
          onChange={setPressureRange}
        />

        <Palette
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </Col>
      <Col span={1}>{renderLegend()}</Col>
      <Col span={8}>
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
                  background: `hsl(${hsl.h}, ${hsl.s * 100}%, ${getLightness(
                    pressure
                  )}%)`
                }}
              >
                {showNumber && pressure}
              </div>
            );
          })}
        </div>
        <div>
          <Switch
            checked={showNumber}
            style={{ marginRight: 10 }}
            onChange={() => setShowNumber(!showNumber)}
          />
          <span>Show numbers</span>
        </div>
      </Col>
      <Col span={10} style={{ height: '100vh', overflow: 'scroll' }}>
        <div style={{ height: 1000, marginLeft: 30, background: 'yellow' }}>
          aaa
        </div>
      </Col>
    </Row>
  );
};

export default App;
