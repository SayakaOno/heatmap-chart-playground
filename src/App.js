import React, { useState, useEffect } from 'react';
import { Row, Col, InputNumber, Switch, Button } from 'antd';
import 'antd/dist/antd.css';
import html2canvas from 'html2canvas';
import Palette from './Palette';
import './App.css';
import w3color, { usedColors } from './w3color';

const App = () => {
  const [pressureRange, setPressureRange] = useState(3);
  const [selectedColor, setSelectedColor] = useState(usedColors[0]);
  const [showNumber, setShowNumber] = useState(false);
  const [pressures, setPressures] = useState([]);
  const [history, setHistory] = useState([]);

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

  const shot = async () => {
    html2canvas(document.querySelector('#capture'))
      .then(canvas => {
        const imgData = canvas.toDataURL();
        return imgData;
      })
      .then(imgData => {
        const newRecord = [
          ...history,
          [`${selectedColor}-${pressureRange}`, imgData]
        ];
        setHistory(newRecord);
      });
  };

  return (
    <Row style={{ padding: 20, height: 'calc(100vh - 40px)' }}>
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
      <Col
        span={10}
        style={{ height: 'calc(100vh - 40px)', overflow: 'scroll' }}
      >
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

export default App;
