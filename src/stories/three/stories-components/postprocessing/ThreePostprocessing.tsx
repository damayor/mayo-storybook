import {
  EffectComposer,
  Noise,
  Scanline,
  ChromaticAberration,
  Vignette,
  Glitch,
} from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { Vector2 } from 'three';
import { useCameraDebug } from '../../non-stories-components/hooks/useCameraDebug.js';
import { ObjRenderer } from '../../../cpp/ObjRenderer/ObjRenderer.js';
import { Ply3DRenderer } from '../../../cpp/PlyRenderer/PlyRenderer.stories.js';
import { PlyRenderer } from '../../../cpp/PlyRenderer/PlyRenderer.js';
import { MouseWarpEffectPass } from '../../non-stories-components/effects/MouseWarpPass.js';

// --- Mesh transform defaults (extracted from useControls) ---
// const posX  = -187
// const posY  = -62
// const posZ  = 193
// const rotX  = -Math.PI / 2
// const rotY  = 0
// const rotZ  = 0
// const scale = 1

interface ThreePostprocessingProps {
  // Noise
  noiseOpacity?: number;
  // Scanline
  scanlineDensity?: number;
  scanlineOpacity?: number;
  // Chromatic Aberration
  chromaticOffsetX?: number;
  chromaticOffsetY?: number;
  // Vignette
  vignetteOffset?: number;
  vignetteDarkness?: number;
  // Glitch
  glitchDelayMin?: number;
  glitchDelayMax?: number;
  glitchDurationMin?: number;
  glitchDurationMax?: number;
  glitchStrengthMin?: number;
  glitchStrengthMax?: number;
  glitchRatio?: number;
}

// Bare effects only — no EffectComposer, no ObjRenderer.
// Use this when composing into an existing EffectComposer (e.g. CameraPath scene).
export function ThreePostprocessingEffects({
  noiseOpacity = 0.5,
  scanlineDensity = 0.5,
  scanlineOpacity = 0.9,
  chromaticOffsetX = 0.004,
  chromaticOffsetY = -0.003,
  vignetteOffset = 0.58,
  vignetteDarkness = 0.58,
  glitchDelayMin = 6.5,
  glitchDelayMax = 12.5,
  glitchDurationMin = 0.6,
  glitchDurationMax = 0.9,
  glitchStrengthMin = 0.3,
  glitchStrengthMax = 0.38,
  glitchRatio = 1.0,
}: ThreePostprocessingProps) {
  return (
    <>
      <Noise opacity={noiseOpacity} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Scanline
        blendFunction={BlendFunction.OVERLAY}
        density={scanlineDensity}
        opacity={scanlineOpacity}
      />
      <ChromaticAberration
        offset={new Vector2(chromaticOffsetX, chromaticOffsetY)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={vignetteOffset} darkness={vignetteDarkness} />
      <Glitch
        delay={new Vector2(glitchDelayMin, glitchDelayMax)}
        duration={new Vector2(glitchDurationMin, glitchDurationMax)}
        strength={new Vector2(glitchStrengthMin, glitchStrengthMax)}
        mode={GlitchMode.SPORADIC}
        active
        ratio={glitchRatio}
      />
      {/* <MouseWarpEffectPass /> */}
    </>
  );
}

// Full standalone component — EffectComposer + ObjRenderer included.
// Use this in stories or any isolated canvas.
export function ThreePostprocessing(props: ThreePostprocessingProps) {
  useCameraDebug();
  return (
    <>
      <PlyRenderer />
      <EffectComposer multisampling={0}>
        <ThreePostprocessingEffects {...props} />
      </EffectComposer>
    </>
  );
}
