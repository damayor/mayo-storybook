import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Object3D, Color } from 'three'
import * as THREE from 'three'
import type { GLTF } from 'three/examples/jsm/Addons.js'
import { positionYOffset, positionYScale, positionYTimeScale, rotationXYScale, rotationXYTimeScale, rotationZScale, rotationZTimeOffset, rotationZTimeScale, SIZE } from '../../helpers/constants/product.config'
import { useFrame } from '@react-three/fiber'

const GLB_PATH = 'assets/meshes/Headphone.glb'

export interface MaterialSelectorProps {
  customColor: string
}

interface Object3DWithGeometry extends Object3D {
  geometry: THREE.BufferGeometry
}

export type GTLFResult = GLTF & {
  nodes: {
    [name: string]: Object3DWithGeometry
  }
  materials: {
    [name: string]: THREE.MeshStandardMaterial
  }
}

const MaterialSelector = ({ customColor }: MaterialSelectorProps) => {
    const ref = useRef<Object3D| null>(null)
    const {nodes, materials } = useGLTF(GLB_PATH) as unknown as GTLFResult

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime() * 2
      if (ref.current) {
        ref.current.rotation.z = (rotationZTimeOffset + Math.sin(t / rotationZTimeScale)) / rotationZScale
        ref.current.rotation.x = Math.cos(t / rotationXYTimeScale) / rotationXYScale
        ref.current.rotation.y = t / 3
        ref.current.position.y = (positionYOffset + Math.sin(t / positionYTimeScale)) / positionYScale
      }
    })

  const threeColor = useMemo(() => {
      return new Color(customColor)
  }, [customColor])

  const customaterial14 = useMemo(() => {
    return {
      ...materials['Material.014'],
      color: threeColor,
      emissive: threeColor,
    }
  }, [materials, threeColor])
  
  const customaterial11 = useMemo(() => {
    return {
      ...materials['Material.011'],
      color: threeColor,
    }
  }, [materials, threeColor])

  const material10Rougher = {
    ...materials['Material.010'],
    roughness: 0.45,
  }

  const material16Rougher = {
    ...materials['Material.016'],
    metalness: 0.1,
    roughness: 0.45,
  }

  return (
    <group key={GLB_PATH} ref={ref} scale={[SIZE, SIZE, SIZE]}>
      <group position={[0, 0.53, 0]} rotation={[0, 0, 1.98]} scale={[0.0217, 0.00061243, 0.0135]}>
        <mesh geometry={nodes.Cube003.geometry} material={materials['Material.017']} />
        <mesh {...nodes.Cube003_1}>
          <bufferGeometry {...nodes.Cube003_1.geometry} />
          <meshStandardMaterial {...material16Rougher} />
        </mesh>
        <mesh geometry={nodes.Cube003_2.geometry} material={materials['Material.015']} />
        <mesh {...nodes.Cube003_3}>
          <bufferGeometry {...nodes.Cube003_3.geometry} />
          <meshStandardMaterial {...customaterial14} />
        </mesh>
        <mesh geometry={nodes.Cube003_4.geometry} material={materials['Material.013']} />
        <mesh geometry={nodes.Cube003_5.geometry} material={materials['Material.012']} />
        <mesh {...nodes.Cube003_6}>
          <bufferGeometry {...nodes.Cube003_6.geometry} />
          <meshStandardMaterial {...customaterial11} />
        </mesh>
        <mesh {...nodes.Cube003_7}>
          <bufferGeometry {...nodes.Cube003_7.geometry} />
          <meshStandardMaterial {...material10Rougher} />
        </mesh>
        <mesh geometry={nodes.Cube003_8.geometry} material={materials['Material.008']} />
      </group>
    </group>
  )
}

export default MaterialSelector