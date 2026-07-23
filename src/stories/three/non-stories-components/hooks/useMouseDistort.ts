import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector2 } from 'three';
import type { ShaderMaterial } from 'three';

// Drives the uniforms of a ShaderMaterial with mouse NDC position + velocity.
// Attach the returned materialRef to the <shaderMaterial> of your points mesh.
export function useMouseDistort(materialRef: React.RefObject<ShaderMaterial | null>) {
  const { size } = useThree();
  const mouseNDC = useRef(new Vector2(0, 0));
  const prevNDC = useRef(new Vector2(0, 0));
  const velNDC = useRef(new Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      prevNDC.current.copy(mouseNDC.current);
      mouseNDC.current.set((e.clientX / size.width) * 2 - 1, (e.clientY / size.height) * -2 + 1);
      velNDC.current.subVectors(mouseNDC.current, prevNDC.current);
      // Normalize velocity so it's just direction; shader biases only by direction
      if (velNDC.current.length() > 0.001) velNDC.current.normalize();
      else velNDC.current.set(0, 0);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [size]);

  useFrame(() => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uMouse.value.copy(mouseNDC.current);
    mat.uniforms.uMouseVel.value.copy(velNDC.current);
  });
}

// Vertex shader: displaces points away from the mouse with a wake bias behind it.
export const distortVertexShader = /* glsl */ `
  uniform vec2  uMouse;     // NDC mouse position
  uniform vec2  uMouseVel;  // normalized mouse velocity direction
  uniform float uRadius;    // influence radius in NDC space (e.g. 0.25)
  uniform float uStrength;  // max displacement in view space (e.g. 2.0)
  uniform float uSize;      // base point size

  void main() {
    vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);
    vec4 clipPos = projectionMatrix * mvPos;
    vec2 ndc     = clipPos.xy / clipPos.w;

    vec2  toVertex = ndc - uMouse;
    float dist     = length(toVertex);

    // Radial falloff — smooth from centre to uRadius
    float radial = 1.0 - smoothstep(0.0, uRadius, dist);

    // Wake bias: vertices behind the cursor (in the trail) get more displacement
    float wakeBias = 1.0;
    if (dot(uMouseVel, uMouseVel) > 0.001) {
      float behind = dot(normalize(toVertex), -uMouseVel); // 1 = directly behind mouse
      wakeBias = mix(0.25, 1.0, clamp(behind * 0.5 + 0.5, 0.0, 1.0));
    }

    float influence = radial * wakeBias;

    // Push vertex outward from mouse in view/screen space
    if (dist > 0.001) {
      mvPos.xy += (toVertex / dist) * influence * uStrength;
    }

    gl_Position  = projectionMatrix * mvPos;
    gl_PointSize = uSize * (300.0 / -mvPos.z);
  }
`;

export const distortFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  void main() {
    // Circular point shape
    vec2 coord = gl_PointCoord - 0.5;
    if (length(coord) > 0.5) discard;
    gl_FragColor = vec4(uColor, 0.8);
  }
`;
