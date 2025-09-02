"use client";

import React from 'react';

/**
 * A simple, reusable donut chart component that supports two parameters
 * with customizable colors, sizes, and label text.
 */
const DonutChart = ({ 
  data, // Array of objects with value and color properties
  size = 100, 
  thickness = 8, 
  label, // Optional label to display in center
  valueFormatter = (value) => value, // Optional function to format values
  className
}) => {
  // Validate data - ensure we have at least one item but not more than two
  if (!data || data.length === 0 || data.length > 2) {
    console.error('DonutChart requires 1 or 2 data items');
    return null;
  }

  const radius = size / 2;
  const innerRadius = radius - thickness;
  const circumference = 2 * Math.PI * innerRadius;
  
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Generate segments
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? item.value / total : 0;
    const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
    
    // Calculate rotation - first segment starts at top, second rotates to follow
    const rotation = index === 0 ? -90 : (data[0].value / total * 360) - 90;
    
    return {
      percentage,
      strokeDasharray,
      rotation,
      color: item.color,
      value: item.value
    };
  });

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* SVG for the donut chart */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={thickness}
        />
        
        {/* Segments */}
        {segments.map((segment, index) => (
          <circle
            key={index}
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="transparent"
            stroke={segment.color}
            strokeWidth={thickness}
            strokeDasharray={segment.strokeDasharray}
            strokeDashoffset={0}
            style={{
              transform: `rotate(${segment.rotation}deg)`,
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      
      {/* Center label */}
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {typeof label === 'string' ? (
            <div className="text-lg font-medium">{label}</div>
          ) : label}
        </div>
      )}
      
      {/* Legend (optional) - can be shown outside the component */}
      {false && (
        <div className="absolute -bottom-20 flex justify-center w-full gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm">{valueFormatter(item.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonutChart; 