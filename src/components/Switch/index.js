import React from 'react';
import './Switch.css';

function Switch({ checked, onChangeValue }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={!!checked} onChange={onChangeValue} />
      <span className="slider round" />
    </label>
  );
}

export default Switch;
