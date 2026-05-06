import React, { useState, useCallback } from 'react';
import { useUI } from './hooks/useUI';
import { ViewSettings } from './components/ViewSettings';
import { ProjectionSettings } from './components/ProjectionSettings';
import { ZoomControl } from './components/ZoomControl';
import { WebGLCanvas } from './components/WebGLCanvas';
import { InstructionsPanel } from './components/InstructionsPanel';
import { LogMessage } from './components/LogMessage';
import { InteractionModeControl } from './components/InteractionModeControl';

const WebglBasis: React.FC = () => {
  const { state, setInteractionMode, setViewMode, setProjectionType, setZoom } = useUI(1050, 750);
  const [showPickFrame, setShowPickFrame] = useState(false);
  const logRef = React.useRef<{ log: (msg: string) => void }>({ log: () => {} });

  const handleInteractionStart = useCallback((x: number, y: number) => {
    logRef.current?.log?.(`Started at (${x.toFixed(0)}, ${y.toFixed(0)})`);
  }, []);

  const handleInteractionMove = useCallback(() => {
    // Optional: Update cursor or preview
  }, []);

  const handleInteractionEnd = useCallback(() => {
    logRef.current?.log?.('Interaction complete');
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* WebGL Canvas - Behind all UI */}
      <div className="absolute inset-0 z-0">
        <WebGLCanvas
          uiState={state}
          onInteractionStart={handleInteractionStart}
          onInteractionMove={handleInteractionMove}
          onInteractionEnd={handleInteractionEnd}
        />
      </div>

      {/* UI Control Panel - Above Canvas */}
      <div className="relative z-20 bg-white p-4 flex justify-around flex-wrap gap-4 shadow-md border-b border-gray-200">
        {/* InteractionModeControl commented out for testing */}
        <InteractionModeControl
          value={state.interactionMode}
          onChange={setInteractionMode}
        />
        <ViewSettings
          viewMode={state.viewMode}
          onViewModeChange={setViewMode}
          showPickFrame={showPickFrame}
          onShowPickFrameChange={setShowPickFrame}
        />
        <ProjectionSettings
          projectionType={state.projectionType}
          onChange={setProjectionType}
        />
        <ZoomControl
          value={state.zoom}
          onChange={setZoom}
        />
      </div>

      {/* Instructions Panel */}
      <div className="absolute bottom-20 left-4 z-20 bg-white text-black rounded-lg p-3 shadow-lg">
        <InstructionsPanel />
      </div>

      {/* Log Messages - Below Instructions Panel */}
      <div className="absolute bottom-1 left-4 z-20 bg-amber-50 text-red-600 rounded-lg text-center py-2 px-4 shadow-lg border border-red-200">
        <LogMessage ref={logRef} />
      </div>
    </div>
  );
};

export default WebglBasis;