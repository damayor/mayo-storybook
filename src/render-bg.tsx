// Dev-only entry used by scripts/render-bg-video.mjs: renders ONLY the Berlin background,
// with scroll sync disabled, and exposes a deterministic frame driver on window.
import { createRoot } from 'react-dom/client';
import {
  CameraPathBackground,
  sheet,
} from './components/camera-path-background/CameraPathBackground';

declare global {
  interface Window {
    __bgReady?: boolean;
    __bgSetTime?: (seconds: number) => void;
  }
}

window.__bgSetTime = (seconds) => {
  sheet.sequence.position = seconds;
};

createRoot(document.getElementById('root')!).render(
  <CameraPathBackground scrollMode="none" onLoaded={() => (window.__bgReady = true)} />
);
