import React from 'react';
import type { ViewMode } from '../types';

interface ViewSettingsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showPickFrame: boolean;
  onShowPickFrameChange: (show: boolean) => void;
}

export const ViewSettings: React.FC<ViewSettingsProps> = ({
  viewMode,
  onViewModeChange,
  showPickFrame,
  onShowPickFrameChange,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-bold uppercase my-2">View Settings</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="primitives"
            value="points"
            checked={viewMode === 'points'}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
          />
          Points
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="primitives"
            value="edges"
            checked={viewMode === 'edges'}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
          />
          Wireframe
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="primitives"
            value="faces"
            checked={viewMode === 'faces'}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
          />
          Faces
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="primitives"
            value="triangles"
            checked={viewMode === 'triangles'}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
          />
          Triangles
        </div>
      </div>
      <hr className="w-full my-2" />
      <div className="flex items-center gap-2">
        <span className="text-sm">Selection Frame</span>
        <input
          type="checkbox"
          id="pickImg"
          checked={showPickFrame}
          onChange={(e) => onShowPickFrameChange(e.target.checked)}
          className="scale-150"
        />
      </div>
    </div>
  );
};
