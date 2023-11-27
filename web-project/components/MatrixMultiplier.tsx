"use client"
import React, { useState } from 'react';


interface MatrixInputProps {
  rows: number;
  cols: number;
  //onChange: (row: number, col: number, value: number) => void;
}

const MatrixInput: React.FC<MatrixInputProps> = ({ rows, cols }) => {
  return (
    <div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', marginBottom: '10px' }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <input
              key={colIndex}
              type="number"
              style={{ width: '50px', marginRight: '10px' }}
              //onChange={(e) => onChange(rowIndex, colIndex, Number(e.target.value))}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

//interface MatrixMultiplierProps {}

// const MatrixMultiplier: React.FC<MatrixMultiplierProps> = () => {
//   // Основний компонент для множення матриць
//   // ...
// };

export default MatrixInput;