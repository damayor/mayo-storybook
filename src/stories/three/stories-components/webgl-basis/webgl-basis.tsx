import React, { useState, useCallback } from 'react';
import { useUI } from './hooks/useUI';
import { InteractionModeControl } from './components/InteractionModeControl';
import { ViewSettings } from './components/ViewSettings';
import { ProjectionSettings } from './components/ProjectionSettings';
import { ZoomControl } from './components/ZoomControl';
import { WebGLCanvas } from './components/WebGLCanvas';
import { InstructionsPanel } from './components/InstructionsPanel';
import { LogMessage } from './components/LogMessage';

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
      {/* UI Control Panel */}
      <div className="bg-white p-4 flex justify-around flex-wrap gap-4 shadow-md">
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

      {/* Log Messages */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 bg-amber-50 text-red-600 rounded-lg text-center py-2 px-4 shadow-lg border border-red-200">
        <LogMessage ref={logRef} />
      </div>

      {/* Instructions Panel */}
      <div className="absolute bottom-32 left-4 bg-white text-black rounded-lg p-3 shadow-lg">
        <InstructionsPanel />
      </div>

      {/* WebGL Canvas */}
      <WebGLCanvas
        uiState={state}
        onInteractionStart={handleInteractionStart}
        onInteractionMove={handleInteractionMove}
        onInteractionEnd={handleInteractionEnd}
      />
    </div>
  );
};

export default WebglBasis;