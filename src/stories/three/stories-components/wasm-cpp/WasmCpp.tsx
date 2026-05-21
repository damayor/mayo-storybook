import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import cityParserModule from './obj_parser.js'; // Tu código generado por emcc
import { useControls, folder } from 'leva';


export function BerlinCityBackground() {
  const [vertices, setVertices] = useState<Float32Array | null>(null);
  const { posX, posY, posZ, rotX, rotY, rotZ, scale } = useControls({
    Transform: folder({
      posX: { value: 0, min: -500, max: 500, step: 1, label: 'Pos X' },
      posY: { value: 0, min: -500, max: 500, step: 1, label: 'Pos Y' },
      posZ: { value: 0, min: -500, max: 500, step: 1, label: 'Pos Z' },
      rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot X' },
      rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot Y' },
      rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot Z' },
      scale: { value: 1, min: 0.01, max: 10, step: 0.01, label: 'Scale' },
    })
  })

  useEffect(() => {
    async function loadCityData() {
      // 1. JS actúa como mensajero: descarga el archivo usando la ruta
      const response = await fetch('/assets/meshes/mesh_berlin/Mesh_3894_58196_-002.obj');
      const objText = await response.text();

      const firstTenLines = objText.split('\n').slice(0, 1000).join('\n');
      console.log(firstTenLines); //bebeeee ahi todavia no lo ha editadoo

      // 2. Inicializamos el módulo WASM
      const instance = await cityParserModule();
      const parser = new instance.CityParser();

      // 3. Pasamos el CONTENIDO (string) a C++ para el parseo veloz
      parser.parse_obj(objText);

      // 4. Obtenemos la vista de memoria (Float32Array)
      const view = parser.get_vertices_view();

      console.log('parsedvertex',view); //bebeeee ahi todavia no lo ha editadoo
      
      // Creamos una copia para que JS gestione la memoria del renderizado
      setVertices(new Float32Array(view));

      // 5. LIMPIEZA: Liberamos el vector de C++ de tus 16GB de RAM
      parser.delete(); 
      // console.log(vertices);

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
          count={vertices.length / 3} // Cada punto tiene 3 componentes (X, Y, Z)
          // array={vertices}
          // itemSize={3}
          args={[vertices, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={2}           // Ajusta el tamaño de cada punto según la escala de Berlín
        color="#ff0000"       // Estilo "tecno" verde
        sizeAttenuation={true} // Los puntos se ven más pequeños a la distancia
        // transparent={true}
        opacity={0.8}
      />
    </points>

  );
}