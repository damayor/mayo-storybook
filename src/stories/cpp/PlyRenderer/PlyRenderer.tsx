import { useEffect, useState } from 'react'
import plyParserModule from './ply_parser.js'
import { useCameraDebug } from '../../three/non-stories-components/hooks/useCameraDebug.js'

export function PlyRenderer() {

  //verticesAlex
  const [verticesA, setVerticesA] = useState<Float32Array | null>(null)
  
  // verticesBrandem
  const [verticesB, setVerticesB] = useState<Float32Array | null>(null)  
  
  useCameraDebug()

  useEffect(() => {
    async function loadData() {
      const instance = await plyParserModule()
      const parser = new instance.PlyParser()

      const responseA = await fetch('/assets/meshes/mesh_berlin/alexplatz.ply')
      const textA = await responseA.text()
      parser.parse_mesh_a(textA)
      setVerticesA(new Float32Array(parser.get_vertices_a()))

      const responseB = await fetch('/assets/meshes/mesh_berlin/bundestag.ply')
      const textB = await responseB.text()
      parser.parse_mesh_b(textB)
      setVerticesB(new Float32Array(parser.get_vertices_b()))

      parser.delete()
    }
    loadData()
  }, [])

  if (!verticesB) return null

  return (
    <points >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={verticesB.length / 3}
          args={[verticesB, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
      {verticesA && (
        <points position={[0, 500, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={verticesA.length / 3}
              args={[verticesA, 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.5} color="#bd457a" sizeAttenuation transparent opacity={0.8} />
        </points>
        )}
    </points>
 
  )
}