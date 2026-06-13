import React from 'react';

export const InstructionsPanel: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-bold">3D Cube Editor — WebGL</div>
      <div className="text-xs text-gray-700 space-y-1">
        <div><span className="font-semibold">Hover</span> vertex → orange highlight</div>
        <div><span className="font-semibold">Left-click</span> vertex → select (white)</div>
        <div><span className="font-semibold">Drag</span> selected vertex → move in XY</div>
        <div><span className="font-semibold">Right-drag</span> canvas → rotate camera</div>
        <div><span className="font-semibold">Zoom</span> slider → frame the cube</div>
        <div><span className="font-semibold">Esc</span> → deselect vertex</div>
      </div>
    </div>
  );
};
