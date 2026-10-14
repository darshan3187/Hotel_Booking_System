import React from 'react';
import '../styles/marquee.css';

export function Marquee({
  children,
  reverse = false,
  pauseOnHover = true,
  className = '',
  repeat = 4,
  duration = '25s',
  style = {},
  ...props
}) {
  return (
    <div
      {...props}
      className={`marquee-container ${className}`}
      style={{ '--marquee-duration': duration, ...style }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={`marquee-content ${reverse ? 'reverse' : ''} ${
            pauseOnHover ? 'pause-on-hover' : ''
          }`}
          style={{
            animation: `marquee-scroll ${duration} linear infinite`,
            animationDirection: reverse ? 'reverse' : 'normal'
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export default Marquee;
