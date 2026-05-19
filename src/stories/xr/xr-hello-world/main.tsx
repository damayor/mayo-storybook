import { createRoot } from 'react-dom/client'
import AppXR from './AppXR'

// Three.js r130+ uses XRWebGLBinding for WebXR layers. The Immersive Web
// Emulator polyfill sessions fail the native XRWebGLBinding type check.
// Removing it forces Three.js onto the XRWebGLLayer fallback path, which
// the polyfill fully supports.
if (typeof window !== 'undefined') {
  delete (window as any).XRWebGLBinding
}

createRoot(document.getElementById('root')!).render(<AppXR />)
