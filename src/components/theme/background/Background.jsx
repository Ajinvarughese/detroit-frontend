import React from 'react';
import './Background.css';

const Background = ({ children }) => {
  return (
    <div className="bubble-background">
      {[...Array(20)].map((_, i) => {
        const size = 8 + Math.random() * 12; // same value for width and height
        return (
          <div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        );
      })}
      <div className="bubble-content">
        {children}
      </div>
    </div>
  );
};

export default Background;
