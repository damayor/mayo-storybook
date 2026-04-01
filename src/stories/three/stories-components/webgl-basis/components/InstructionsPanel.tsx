import React from 'react';

export const InstructionsPanel: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">Cube editor with just WebGL</div>
      <div className="text-sm text-gray-700">
        <ul className="list-disc list-inside space-y-1">
          <li>Select any vertex with left click</li>
          <li>Move camera with the right click + drag</li>
          <li>Use zoom slider to adjust view</li>
        </ul>
      </div>
    </div>
  );
};
