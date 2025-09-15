
import { useFrame } from '@react-three/fiber';
import React from 'react';

import { useRef } from 'react'
import { Object3D } from 'three';


export default function Box(props: any) {
  const ref = useRef<Object3D>(new Object3D())

  useFrame((state, delta) => (ref.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'red'} />
    </mesh>
  )
}