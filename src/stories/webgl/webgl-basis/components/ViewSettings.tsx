import React from 'react';
import type { ViewMode } from '../types';

interface ViewSettingsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewSettings: React.FC<ViewSettingsProps> = ({ viewMode, onViewModeChange }) => {
  const radio = (v: ViewMode, label: string, sub?: string) => (
    <label key={v} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="radio"
        name="primitives"
        value={v}
        checked={viewMode === v}
        onChange={() => onViewModeChange(v)}
      />
      <span className="text-sm">
        {label}
        {sub && <span className="ml-1 text-xs text-gray-400">{sub}</span>}
      </span>
    </label>
  );

  return (
    <div className="flex flex-col items-start">
      <h4 className="text-sm font-bold uppercase my-2">View Mode</h4>
      <div className="space-y-1">
        {radio('wireframe', 'Wireframe', '+ Points')}
        {radio('points', 'Points', '(selectable)')}
        {radio('faces', 'Faces')}
        {radio('triangles', 'Triangles')}
      </div>
    </div>
  );
};
