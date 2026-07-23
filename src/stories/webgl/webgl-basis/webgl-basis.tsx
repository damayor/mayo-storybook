import React, { useCallback, useRef, useState } from 'react';
import { useUI } from './hooks/useUI';
import { ViewSettings } from './components/ViewSettings';
import { ProjectionSettings } from './components/ProjectionSettings';
import { ZoomControl } from './components/ZoomControl';
import { WebGLCanvas } from './components/WebGLCanvas';
import { InstructionsPanel } from './components/InstructionsPanel';
import { InteractionModeControl } from './components/InteractionModeControl';
import { StatusBar } from './components/StatusBar';
import { GizmoOverlay } from './components/GizmoOverlay';

const WebglBasis: React.FC = () => {
  const {
    state,
    setInteractionMode,
    setViewMode,
    setProjectionType,
    setZoom,
    rotateCamera,
    setHoveredVertex,
    setSelectedVertex,
    startDraggingVertex,
    stopDraggingVertex,
    updateVertexPosition,
    updateCanvasDimensions,
  } = useUI();

  const [logMessage, setLogMessage] = useState('Ready');
  const [showInstructions, setShowInstructions] = useState(false);
  const instructionsRef = useRef<HTMLDivElement>(null);

  const handleLog = useCallback((msg: string) => setLogMessage(msg), []);

  return (
    /*
     * Use position:fixed so the component always fills the viewport
     * regardless of what wrapper the Storybook decorator puts around it.
     * This avoids the scroll caused by the withTheme <div> having no height.
     */
    <div
      className="flex flex-col bg-white"
      style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex-none flex flex-wrap items-start gap-5 px-4 py-2 bg-white border-b border-gray-200 shadow-sm z-20">
        {/* 1. View Mode — first */}
        <ViewSettings viewMode={state.viewMode} onViewModeChange={setViewMode} />

        <div className="w-px self-stretch bg-gray-200" />

        {/* 2. Interaction Mode — context-sensitive, second */}
        <InteractionModeControl
          value={state.interactionMode}
          viewMode={state.viewMode}
          onChange={setInteractionMode}
        />

        <div className="w-px self-stretch bg-gray-200" />

        {/* 3. Projection */}
        <ProjectionSettings projectionType={state.projectionType} onChange={setProjectionType} />

        <div className="w-px self-stretch bg-gray-200" />

        {/* 4. Zoom */}
        <ZoomControl value={state.zoom} onChange={setZoom} />

        <div className="w-px self-stretch bg-gray-200" />

        {/* Help toggle */}
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-sm font-bold uppercase my-2 invisible select-none">h</h4>
          <button
            className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
            onClick={() => setShowInstructions((v) => !v)}
          >
            {showInstructions ? 'Hide Help' : '? Help'}
          </button>
        </div>
      </div>

      {/* ── Canvas area ──────────────────────────────────────────────────── */}
      <div className="flex-1 relative min-h-0">
        <WebGLCanvas
          uiState={state}
          onHoverVertex={setHoveredVertex}
          onSelectVertex={setSelectedVertex}
          onStartDrag={startDraggingVertex}
          onStopDrag={stopDraggingVertex}
          onMoveVertex={updateVertexPosition}
          onCameraRotate={rotateCamera}
          onResize={updateCanvasDimensions}
          onLog={handleLog}
        />

        {/* XYZ axis gizmo — bottom-right corner */}
        <GizmoOverlay modelview={state.modelview} />

        {/* Floating instructions — shown on demand */}
        {showInstructions && (
          <div
            ref={instructionsRef}
            className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm text-black rounded-lg p-3 shadow-lg border border-gray-200"
          >
            <InstructionsPanel />
          </div>
        )}
      </div>

      {/* ── Status bar ───────────────────────────────────────────────────── */}
      <div className="flex-none z-20">
        <StatusBar
          hoveredIndex={state.hoveredVertexIndex}
          selectedIndex={state.selectedVertexIndex}
          isDragging={state.isDraggingVertex}
          logMessage={logMessage}
        />
      </div>
    </div>
  );
};

export default WebglBasis;
