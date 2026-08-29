import { Effect, EffectAttribute } from 'postprocessing';
import { Uniform, Vector2 } from 'three';

// Screen-space UV warp driven by mouse NDC + velocity.
// Everything rendered below is displaced — no geometry touched.
//
// Sign convention (this was the "funnel" bug):
//   sampling at  uv + pushDir  reads pixels FARTHER from the cursor, so the image
//   collapses inward → funnel / pinch.
//   sampling at  uv - pushDir  reads pixels CLOSER to the cursor, so the image
//   spreads outward → magnifier / fisheye ("eye" lens).
// uMode selects the falloff: 0 = funnel (legacy), 1 = lens (bulge).
const fragmentShader = /* glsl */ `
  uniform vec2  uMouse;     // NDC mouse (-1..1 both axes, +y = top)
  uniform vec2  uMouseVel;  // normalized velocity direction (same space)
  uniform float uRadius;    // influence radius in UV space
  uniform float uStrength;  // max UV displacement
  uniform float uWake;      // 0 = symmetric lens, 1 = full velocity wake bias
  uniform float uMode;      // 0 = funnel (pinch), 1 = lens (bulge)
  uniform float uAspect;    // viewport aspect (w / h) — keeps the lens circular

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // NDC → UV: x stays, y stays (postprocessing UV y=0=bottom matches NDC y=−1=bottom)
    vec2 mouseUV = uMouse * 0.5 + 0.5;

    // Work in aspect-corrected space so the influence area is a circle, not an ellipse
    vec2  toUV   = uv - mouseUV;
    vec2  toAsp  = vec2(toUV.x * uAspect, toUV.y);
    float dist   = length(toAsp);

    float t = clamp(dist / max(uRadius, 0.0001), 0.0, 1.0);

    // Lens profile: 0 at the rim, peaks partway in, 0 again at the exact centre so the
    // focal point stays undistorted instead of collapsing to a single sampled texel.
    float lens   = sin(t * 3.14159265) * (1.0 - t);
    // Funnel profile: strongest at the centre (the original behaviour)
    float pinch  = 1.0 - smoothstep(0.0, 1.0, t);
    float radial = mix(pinch, lens, uMode);

    // Wake bias — the trail behind the cursor gets more distortion.
    // Fully disabled at uWake = 0 so the lens stays radially symmetric.
    float wakeBias = 1.0;
    if (dot(uMouseVel, uMouseVel) > 0.001 && dist > 0.0001) {
      float behind = dot(normalize(toAsp), -vec2(uMouseVel.x * uAspect, uMouseVel.y));
      wakeBias = mix(1.0, mix(0.15, 1.0, clamp(behind * 0.5 + 0.5, 0.0, 1.0)), uWake);
    }

    float influence = radial * wakeBias;
    vec2  pushDir   = dist > 0.0001 ? vec2(toAsp.x / uAspect, toAsp.y) / dist : vec2(0.0);

    // uMode 0 → push outward (funnel), uMode 1 → pull inward (magnify)
    float sign = mix(1.0, -1.0, uMode);

    vec2 distortedUV = uv + sign * pushDir * influence * uStrength;
    outputColor = texture2D(inputBuffer, clamp(distortedUV, vec2(0.0), vec2(1.0)));
  }
`;

export interface MouseWarpEffectOptions {
  onInstance?: (e: MouseWarpEffect) => void;
  radius?: number;
  strength?: number;
  /** 0 = symmetric lens, 1 = full velocity wake bias */
  wake?: number;
  /** 'funnel' = original pinch, 'lens' = magnifier / eye bulge */
  mode?: 'funnel' | 'lens';
}

export class MouseWarpEffect extends Effect {
  constructor(options: MouseWarpEffectOptions = {}) {
    const { radius = 0.22, strength = 0.025, wake = 1, mode = 'funnel' } = options;

    super('MouseWarpEffect', fragmentShader, {
      // REQUIRED: this shader samples inputBuffer at a UV other than the current
      // fragment's. Without CONVOLUTION, postprocessing merges the effect into a shared
      // EffectPass where inputBuffer reads collapse to the already-fetched inputColor —
      // the displaced sample is discarded and the warp silently renders as a no-op.
      // Only ONE convolution effect is allowed per EffectPass.
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, Uniform<unknown>>([
        ['uMouse', new Uniform(new Vector2(0, 0))],
        ['uMouseVel', new Uniform(new Vector2(0, 0))],
        ['uRadius', new Uniform(radius)],
        ['uStrength', new Uniform(strength)],
        ['uWake', new Uniform(wake)],
        ['uMode', new Uniform(mode === 'lens' ? 1 : 0)],
        ['uAspect', new Uniform(1)],
      ]),
    });
    // Give the caller a ref to this instance so uniforms can be updated each frame
    options.onInstance?.(this);
  }
}
