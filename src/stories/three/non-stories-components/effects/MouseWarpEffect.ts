import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';

// Screen-space UV warp driven by mouse NDC + velocity.
// Everything rendered below is displaced — no geometry touched.
const fragmentShader = /* glsl */ `
  uniform vec2  uMouse;     // NDC mouse (-1..1 both axes, +y = top)
  uniform vec2  uMouseVel;  // normalized velocity direction (same space)
  uniform float uRadius;    // influence radius in UV space
  uniform float uStrength;  // max UV displacement

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // NDC → UV: x stays, y stays (postprocessing UV y=0=bottom matches NDC y=−1=bottom)
    vec2 mouseUV = uMouse * 0.5 + 0.5;

    vec2  toUV = uv - mouseUV;
    float dist = length(toUV);

    float radial = 1.0 - smoothstep(0.0, uRadius, dist);

    // Wake bias — vertices in the trail behind the cursor get more distortion
    float wakeBias = 1.0;
    if (dot(uMouseVel, uMouseVel) > 0.001) {
      vec2 velUV = vec2(uMouseVel.x, uMouseVel.y);
      float behind = dot(normalize(toUV), -velUV);
      wakeBias = mix(0.15, 1.0, clamp(behind * 0.5 + 0.5, 0.0, 1.0));
    }

    float influence = radial * wakeBias;
    vec2  pushDir  = dist > 0.001 ? toUV / dist : vec2(0.0, 1.0);

    vec2 distortedUV = uv + pushDir * influence * uStrength;
    outputColor = texture2D(inputBuffer, distortedUV);
  }
`;

export interface MouseWarpEffectOptions {
  onInstance?: (e: MouseWarpEffect) => void;
}

export class MouseWarpEffect extends Effect {
  constructor(options: MouseWarpEffectOptions = {}) {
    super('MouseWarpEffect', fragmentShader, {
      uniforms: new Map<string, Uniform<unknown>>([
        ['uMouse', new Uniform(new Vector2(0, 0))],
        ['uMouseVel', new Uniform(new Vector2(0, 0))],
        ['uRadius', new Uniform(0.22)],
        ['uStrength', new Uniform(0.025)],
      ]),
    });
    // Give the caller a ref to this instance so uniforms can be updated each frame
    options.onInstance?.(this);
  }
}
