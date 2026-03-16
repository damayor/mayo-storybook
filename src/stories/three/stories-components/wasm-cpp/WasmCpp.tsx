import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import initWasm from './wave_gen.js' 

const tempObject = new THREE.Object3D()
const COUNT = 100 
const tempColor = new THREE.Color() 

export function WasmMesh () {
  const [wasmModule, setWasmModule] = useState<any>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    // Inicializar el módulo WASM una sola vez
    initWasm().then((instance) => {
      setWasmModule(new instance.WaveGenerator())
    });
  }, [])

 useFrame(({ clock }) => {
    if (wasmModule && meshRef.current) {
      const spiralData = wasmModule.updateSpiral(COUNT, clock.elapsedTime)
      const yVec = spiralData.yPositions
      const zVec = spiralData.zPositions
      
      for (let i = 0; i < COUNT; i++) {
        const y = yVec.get(i)
        const z = zVec.get(i)

        tempObject.position.set(i * 0.5 - (COUNT * 0.25), y, z )
        tempObject.updateMatrix()
        
        meshRef.current.setMatrixAt(i, tempObject.matrix)

        const hue = (Math.atan2(y, z) / (Math.PI * 2))
        tempColor.setHSL(hue, 0.7, 0.5) // HSL: Matiz dinámico, Saturación 70%, Brillo 50%
        
        meshRef.current.setColorAt(i, tempColor)
      }
      
      meshRef.current.instanceMatrix.needsUpdate = true
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null!, null!, COUNT]}>
      <sphereGeometry args={[0.3, 16, 16]} /> 
      <meshStandardMaterial/>
    </instancedMesh>
    
  )
}