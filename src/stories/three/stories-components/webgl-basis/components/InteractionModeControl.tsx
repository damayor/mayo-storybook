import React from 'react';
import type { InteractionMode, ViewMode } from '../types';

interface InteractionModeControlProps {
  value: InteractionMode;
  viewMode: ViewMode;
  onChange: (mode: InteractionMode) => void;
}

export const InteractionModeControl: React.FC<InteractionModeControlProps> = ({
  value,
  viewMode,
  onChange,
}) => {
  const radio = (v: InteractionMode, label: string, disabled = false) => (
    <label
      key={v}
      className={`flex items-center gap-2 select-none ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      title={disabled ? 'Not yet implemented' : undefined}
    >
      <input
        type="radio"
        name="interaction_mode"
        value={v}
        checked={value === v}
        onChange={() => !disabled && onChange(v)}
        disabled={disabled}
      />
      <span className="text-sm">{label}</span>
      {disabled && <span className="text-xs text-gray-400 italic">soon</span>}
    </label>
  );

  return (
    <div className="flex flex-col items-start">
      <h4 className="text-sm font-bold uppercase my-2">Interaction Mode</h4>
      <div className="space-y-1">
        {(viewMode === 'wireframe' || viewMode === 'points') && (
          <>
            {radio('dragVertex', 'Drag Vertex')}
            {radio('deformFace', 'Deform Face', true)}
          </>
        )}
        {(viewMode === 'faces' || viewMode === 'triangles') && (
          radio('extrudeFace', 'Extrude Face', true)
        )}
      </div>
    </div>
  );
};
