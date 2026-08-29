import { EffectComposer } from '@react-three/postprocessing';
import {
  MouseWarpEffectPass,
  type MouseWarpEffectPassProps,
} from '../../non-stories-components/effects/MouseWarpPass';

export type MouseWarpDemoProps = MouseWarpEffectPassProps;

// Test bed for MouseWarpEffectPass: the same cone mesh used by the MouseParallax story,
// plus a grid so the screen-space distortion is actually readable.
export function MouseWarpDemo({ radius, strength, wake, mode }: MouseWarpDemoProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      <mesh>
        <coneGeometry args={[1.5, 2.5, 4]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
      <mesh>
        <coneGeometry args={[1.5, 2.5, 4]} />
        <meshStandardMaterial color="#ff4444" transparent opacity={0.15} />
      </mesh>

      {/* Straight lines make the funnel vs. lens difference obvious */}
      <gridHelper args={[20, 40, '#66ccff', '#334466']} position={[0, -2, 0]} />

      {/* Single EffectComposer for this canvas — never nest another one */}
      <EffectComposer multisampling={0}>
        <MouseWarpEffectPass radius={radius} strength={strength} wake={wake} mode={mode} />
      </EffectComposer>
    </>
  );
}
