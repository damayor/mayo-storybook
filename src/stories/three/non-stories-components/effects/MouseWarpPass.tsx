import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { wrapEffect } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { MouseWarpEffect, type MouseWarpEffectOptions } from './MouseWarpEffect';

// React component that renders the warp Effect inside an existing <EffectComposer>.
// Do NOT wrap this in its own EffectComposer — there can only be one per canvas.
export const MouseWarpEffectComponent = wrapEffect(MouseWarpEffect);

// Hook that tracks mouse NDC + velocity and writes them into a MouseWarpEffect's uniforms.
// effectRef must point to the effect instance captured via the onInstance constructor callback.
export function useMouseWarpUniforms(
  effectRef: React.RefObject<MouseWarpEffect | null>,
  tunables?: MouseWarpEffectPassProps
) {
  const { gl, size } = useThree();
  const mouseNDC = useRef(new Vector2(0, 0));
  const prevNDC = useRef(new Vector2(0, 0));
  const velNDC = useRef(new Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      prevNDC.current.copy(mouseNDC.current);
      mouseNDC.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        ((e.clientY - rect.top) / rect.height) * -2 + 1
      );
      const vel = new Vector2().subVectors(mouseNDC.current, prevNDC.current);
      velNDC.current = vel.length() > 0.001 ? vel.normalize() : new Vector2(0, 0);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [gl]);

  useFrame(() => {
    const fx = effectRef.current;
    if (!fx) return;
    (fx.uniforms.get('uMouse')!.value as Vector2).copy(mouseNDC.current);
    (fx.uniforms.get('uMouseVel')!.value as Vector2).copy(velNDC.current);
    // Keep the influence area circular regardless of viewport shape
    fx.uniforms.get('uAspect')!.value = size.height > 0 ? size.width / size.height : 1;

    // Tunables are written here rather than in an effect: wrapEffect builds the instance
    // from its own defaults (it does not forward these props to the constructor), and the
    // ref is still null during the commit phase, so an effect keyed on the tunables would
    // bail out on mount and never re-run for args that don't change afterwards.
    if (tunables) {
      const { radius, strength, wake, mode } = tunables;
      if (radius !== undefined) fx.uniforms.get('uRadius')!.value = radius;
      if (strength !== undefined) fx.uniforms.get('uStrength')!.value = strength;
      if (wake !== undefined) fx.uniforms.get('uWake')!.value = wake;
      if (mode !== undefined) fx.uniforms.get('uMode')!.value = mode === 'lens' ? 1 : 0;
    }
  });
}

// Convenience component: warp effect + uniform driver in one.
// Must be rendered INSIDE an existing <EffectComposer> — NOT standalone.
export type MouseWarpEffectPassProps = Omit<MouseWarpEffectOptions, 'onInstance'>;

export function MouseWarpEffectPass({
  radius = 0.22,
  strength = 0.025,
  wake = 1,
  mode = 'funnel',
}: MouseWarpEffectPassProps = {}) {
  const effectRef = useRef<MouseWarpEffect | null>(null);
  useMouseWarpUniforms(effectRef, { radius, strength, wake, mode });

  const onInstance = useCallback((e: MouseWarpEffect) => {
    effectRef.current = e;
  }, []);

  // Only onInstance reaches the constructor — wrapEffect memoizes its args on
  // JSON.stringify(props), so passing the tunables here would not rebuild the effect
  // anyway. They are applied per-frame in useMouseWarpUniforms instead.
  const stableProps = useMemo(() => ({ onInstance }), [onInstance]);

  return <MouseWarpEffectComponent {...stableProps} />;
}
