import React from 'react';

interface ZoomControlProps {
  value: number;
  onChange: (zoom: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const ZoomControl: React.FC<ZoomControlProps> = ({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 0.1,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-bold uppercase my-2">Zoom</h4>
      <div className="flex items-center gap-2">
        <span className="text-sm">−</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer hover:bg-gray-400 transition-colors w-32"
          id="zoom"
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        <span className="text-sm">+</span>
        <span className="text-xs font-semibold w-8 text-right">{value.toFixed(1)}</span>
      </div>
    </div>
  );
};
