import React from 'react';

interface StatusBarProps {
  hoveredIndex: number | null;
  selectedIndex: number | null;
  isDragging: boolean;
  logMessage: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  hoveredIndex,
  selectedIndex,
  isDragging,
  logMessage,
}) => {
  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-gray-900 text-xs font-mono border-t border-gray-700 select-none" style={{ minHeight: 32 }}>
      {/* Hover badge */}
      <span className={`px-2 py-0.5 rounded ${hoveredIndex !== null ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-500'}`}>
        {hoveredIndex !== null ? `Hover: #${hoveredIndex}` : 'Hover: —'}
      </span>

      {/* Selected badge */}
      <span className={`px-2 py-0.5 rounded ${selectedIndex !== null ? (isDragging ? 'bg-green-600 text-white' : 'bg-blue-600 text-white') : 'bg-gray-700 text-gray-500'}`}>
        {selectedIndex !== null
          ? isDragging ? `Dragging: #${selectedIndex}` : `Selected: #${selectedIndex}`
          : 'Selected: —'}
      </span>

      {/* Divider */}
      <span className="text-gray-600">|</span>

      {/* Coordinate log */}
      <span className="text-gray-300 flex-1 truncate">
        {logMessage || 'Ready'}
      </span>
    </div>
  );
};
