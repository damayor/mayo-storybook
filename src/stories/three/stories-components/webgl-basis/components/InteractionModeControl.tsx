import React from 'react';
import type { InteractionMode } from '../types';

interface InteractionModeControlProps {
  value: InteractionMode;
  onChange: (mode: InteractionMode) => void;
}

export const InteractionModeControl: React.FC<InteractionModeControlProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-bold uppercase my-2">Modo de interacción</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="order_clic"
            value="selectClic"
            checked={value === 'selectClic'}
            onChange={(e) => onChange(e.target.value as InteractionMode)}
          />
          Deform face
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="order_clic"
            value="2ndClic"
            checked={value === '2ndClic'}
            onChange={(e) => onChange(e.target.value as InteractionMode)}
          />
          Scale face
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="order_clic"
            value="3rdClic"
            checked={value === '3rdClic'}
            onChange={(e) => onChange(e.target.value as InteractionMode)}
          />
          Extrude Z-axis
        </div>
      </div>
    </div>
  );
};
