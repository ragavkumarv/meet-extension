import React from 'react';
import './SuccessOrError.scss';

export default function SuccessOrError({ status }) {
  return (
    <>
      <div className={`circle-loader ${status}`}>
        <div className="status draw"></div>
      </div>
    </>
  );
}
