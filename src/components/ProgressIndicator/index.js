import React from 'react';
import './ProgressIndicator.css';

function ProgressIndicator({ percentage }) {
  return (
    <div className="ProgressIndicator">
      <div
        className="ProgressIndicator-Inner"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default ProgressIndicator;
