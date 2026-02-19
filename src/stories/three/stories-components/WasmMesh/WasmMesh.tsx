import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import initWasm from './wave_gen.js' // Archivo generado por Emscripten


const tempObject = new THREE.Object3D()
const COUNT = 100 // El número de partículas que definimos en C++

export function WasmMesh () {
  const [wasmModule, setWasmModule] = useState<any>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    // Inicializar el módulo WASM una sola vez
    initWasm().then((instance) => {
      setWasmModule(new instance.WaveGenerator())
    })
  }, [])

 useFrame(({ clock }) => {
    if (wasmModule && meshRef.current) {
      const newYPositions = wasmModule.updateVertices(COUNT, clock.elapsedTime)
      
      for (let i = 0; i < COUNT; i++) {
        tempObject.position.set(i * 0.5 - (COUNT * 0.25), newYPositions.get(i), 0)
        tempObject.updateMatrix()
        
        meshRef.current.setMatrixAt(i, tempObject.matrix)
      }
      
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  //Todo parametrize also color based on Y location.
  return (
    <instancedMesh ref={meshRef} args={[null!, null!, COUNT]}>
      <sphereGeometry args={[0.3, 16, 16]} /> 
      <meshStandardMaterial color="cyan" />
    </instancedMesh>
  )
}