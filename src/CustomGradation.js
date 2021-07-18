import React, { useState } from 'react';
import GradationDemo from './GradationDemo';
import { initialColors } from './gradationGridData';
import './gradation.css';

const CustomGradation = props => {
  const [colors, setColors] = useState(initialColors);
  const [number, setNumber] = useState(9);
  const [count, setCount] = useState(0);
  const [additionalDemoData, setAdditionalDemoData] = useState({});

  const onSetAdditionalDemoData = (index, key, value) => {
    const newData = { ...additionalDemoData };
    if (!newData[index]) {
      newData[index] = {};
    }
    newData[index][key] = value;
    setAdditionalDemoData(newData);
  };

  const renderDemo = () => {
    if (!count) {
      return null;
    }

    const demos = [];
    Object.keys(additionalDemoData).forEach(index => {
      const newData = {};
      const onDelete = () => {
        Object.keys(additionalDemoData).forEach(key => {
          if (key !== index) {
            newData[key] = additionalDemoData[key];
          }
          setAdditionalDemoData(newData);
          setCount(count - 1);
        });
      };

      demos.push(
        <GradationDemo
          numColors={additionalDemoData[index].numColors}
          colors={additionalDemoData[index].colors}
          setColors={value => onSetAdditionalDemoData(index, 'colors', value)}
          onDelete={onDelete}
        />
      );
    });

    return demos;
  };

  const onAddClick = () => {
    if (!number) {
      return;
    }

    const initialColors = [];
    for (let i = 0; i < number; i++) {
      initialColors.push([255, 255, 255]);
    }
    setCount(count + 1);
    const newData = {
      ...additionalDemoData,
      [count]: {
        numColors: number,
        colors: initialColors
      }
    };

    setAdditionalDemoData(newData);
    setNumber(9);
  };

  return (
    <div className="gradation">
      <GradationDemo
        numColors={9}
        initialColors={initialColors}
        colors={colors}
        setColors={setColors}
      />
      {renderDemo()}
      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          value={number}
          onChange={e => setNumber(e.target.value)}
        />
        <button onClick={onAddClick}>Add</button>
      </div>
    </div>
  );
};

export default CustomGradation;
