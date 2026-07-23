import { useEffect, useState } from 'react';
import cityParserModule from './obj_parser.js';
import { useCameraDebug } from '../../three/non-stories-components/hooks/useCameraDebug.js';

const posX = -187;
const posY = -62;
const posZ = 193;
const rotX = -Math.PI / 2;
const rotY = 0;
const rotZ = 0;
const scale = 1;

export function ObjRenderer() {
  const [vertices, setVertices] = useState<Float32Array | null>(null);
  useCameraDebug();

  useEffect(() => {
    async function loadCityData() {
      const response = await fetch('/assets/meshes/mesh_berlin/Mesh_3894_58196_-002.obj');
      const objText = await response.text();
      const instance = await cityParserModule();
      const parser = new instance.CityParser();
      parser.parse_obj(objText);
      setVertices(new Float32Array(parser.get_vertices_view()));
      parser.delete();
    }
    loadCityData();
  }, []);

  if (!vertices) return null;

  return (
    <points position={[posX, posY, posZ]} rotation={[rotX, rotY, rotZ]} scale={scale}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={vertices.length / 3}
          args={[vertices, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}
