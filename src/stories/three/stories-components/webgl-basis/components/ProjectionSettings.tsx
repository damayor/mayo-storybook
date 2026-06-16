import React from 'react';
import type { ProjectionType } from '../types';

interface ProjectionSettingsProps {
  projectionType: ProjectionType;
  onChange: (type: ProjectionType) => void;
}

export const ProjectionSettings: React.FC<ProjectionSettingsProps> = ({
  projectionType,
  onChange,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-bold uppercase my-2">Projection Type</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="camera_perspective"
            value="perspective"
            checked={projectionType === 'perspective'}
            onChange={(e) => onChange(e.target.value as ProjectionType)}
          />
          Perspective
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="camera_perspective"
            value="orthogonal"
            checked={projectionType === 'orthogonal'}
            onChange={(e) => onChange(e.target.value as ProjectionType)}
          />
          Orthogonal
        </div>
      </div>
    </div>
  );
};
