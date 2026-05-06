import React from 'react';

export const InstructionsPanel: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">3D Cube Editor with WebGL</div>
      <div className="text-sm text-gray-700">
        <div className="mb-3">
          <p className="font-semibold mb-2">How to use:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Adjust the <span className="font-semibold">Zoom</span> slider to frame the cube</li>
            <li>Toggle <span className="font-semibold">Projection Type</span> (Perspective/Orthogonal)</li>
            <li>Select <span className="font-semibold">View Settings</span> mode (Wireframe/Faces)</li>
            <li>Left-click on a vertex to select it (future: drag to deform)</li>
            <li>Right-click + drag to rotate the camera</li>
          </ul>
        </div>
        <div className="text-xs text-gray-600 border-t pt-2">
          <p className="italic">Built with native WebGL • No frameworks • Pure graphics API</p>
        </div>
      </div>
    </div>
  );
};
