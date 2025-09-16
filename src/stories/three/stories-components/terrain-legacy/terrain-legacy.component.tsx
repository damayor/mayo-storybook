import { useControls } from 'leva';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';
import { BufferAttribute, BufferGeometry, Color, Object3D, PlaneGeometry, Vector3 } from 'three';

// import MountainMaterial from '../../../shaders/mountain-material';
// import WireframeMaterial from '../../../shaders/wireframe-material';
// import { emmisive, metalness, roughness } from '../../non-stories-components/background/background.config';
import { Plane } from '@react-three/drei';

// @ts-ignore
const generateTerrainLegacy = ({/*simplex,^*/ size, height, levels, scale, offset} ) => {
  // #toremove
  // const noise = (level : number, x : number, z : number) =>
  //   simplex.noise2D( x / height,  z / height ) / level + (level > 1 ? noise(level / 2, x, z) : 0);


  const noise2D = createNoise2D()
  // eslint does not trust me
  // eslint-disable-next-line array-callback-return
  // @ts-ignore
  return Float32Array.from({ length: size ** 2 * 3 }, (_, i) => {
    let v;
    // eslint-disable-next-line default-case
    switch (i % 3) {
      case 0:
        v = i / 3;
        return (offset.x + ((v % size) / size - 0.5)) * scale;
      case 1:
        v = (i - 1) / 3;
        return (
          noise2D(
            // 2 ** levels,
            (v % size) / size - 0.5,
            Math.floor(v / size) / size - 0.5
          ) * height
        );
      case 2:
        v = (i - 2) / 3;
        return (offset.z + Math.floor(v / size) / size - 0.5) * scale;
    }
  });
};


export interface TerrainLegacyProps {
  seed?: number,
  size: number,
  height: number,
  levels: number,
  scale: number,
  offset?: { x: number, z: number },
  // wireframe: boolean,
  handleRayMouse?: (point : Vector3) => void
}

//From https://github.com/Mozzius/r3f-terrain
const TerrainLegacy = ({
  // seed,
  size,
  height,
  levels = 8,
  scale = 1,
  offset = { x: 0, z: 0 },
  // wireframe = false,
  handleRayMouse = () => {}
}: TerrainLegacyProps) => {
  // const simplex = useMemo(() => new SimplexNoise(seed), [seed]);
  // const simplex = useMemo(() => new SimplexNoise(seed), [seed]);
  const ref = useRef<PlaneGeometry & BufferGeometry>(new PlaneGeometry());

  useLayoutEffect(() => {
    if(ref.current){
      ref.current.setAttribute(
        'position',
        new BufferAttribute(
          generateTerrainLegacy({/*simplex,*/ size, height, levels, scale, offset}),
          3
        )
      );
      // ref.current.elementsNeedUpdate = true;
      ref.current.computeVertexNormals();
    }
  }, [size, height, levels, scale, offset/*, simplex*/]);

  return (
    <mesh
      onPointerDown={(e) => console.log('punto presionado', e.point)}
      onPointerMove={(e) => {
        handleRayMouse(e.point)
      }}
      castShadow
      receiveShadow
      position={[0, -3, 0]}
      scale={[5, 5, 5]}
    >
      <planeGeometry
        args={[undefined, undefined, size - 1, size - 1]}
        ref={ref}
      />
      <meshStandardMaterial color="blue" roughness={0.8}  />
      {/* 0x48011D */}
      {/* <Suspense fallback={<WireframeMaterial />}>
        {wireframe ? <WireframeMaterial /> : <MountainMaterial />}
      </Suspense> */}
    </mesh>
  );
};

export default TerrainLegacy;
