import { useEffect, useState } from 'react'
import cityParserModule from './obj_parser.js'
import { useControls, folder } from 'leva';


export function ObjRenderer() {
  const [vertices, setVertices] = useState<Float32Array | null>(null);

  const { posX, posY, posZ, rotX, rotY, rotZ, scale } = useControls({
    Transform: folder({
      posX: { value: -187, min: -500, max: 500, step: 1, label: 'Pos X' },
      posY: { value: -62, min: -500, max: 500, step: 1, label: 'Pos Y' },
      posZ: { value: 193, min: -500, max: 500, step: 1, label: 'Pos Z' },
      rotX: { value: -Math.PI/2, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot X' },
      rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot Y' },
      rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot Z' },
      scale: { value: 1, min: 0.01, max: 10, step: 0.01, label: 'Scale' },
    })
  })

  useEffect(() => {
    async function loadCityData() {
      const response = await fetch('/assets/meshes/mesh_berlin/Mesh_3894_58196_-002.obj');
      const objText = await response.text();

      const firstTenLines = objText.split('\n').slice(0, 1000).join('\n');
      console.log(firstTenLines);

      const instance = await cityParserModule();
      const parser = new instance.CityParser();

      parser.parse_obj(objText);

      const view = parser.get_vertices_view();

      console.log('parsedvertex', view);

      setVertices(new Float32Array(view));

      parser.delete();
    }

    loadCityData();
  }, []);

  if (!vertices) return null;

  return (
     <points
      position={[posX, posY, posZ]}
      rotation={[rotX, rotY, rotZ]}
      scale={scale}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={vertices.length / 3}
          args={[vertices, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        color="#ff00ff"
        sizeAttenuation={true}
        opacity={0.8}
      />
    </points>
  );
}
