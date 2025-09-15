
import { useFrame } from '@react-three/fiber';
import React from 'react';

import { useRef, useState } from 'react'
import { Object3D } from 'three';


export default function Sphere(props: any) {
  const ref = useRef<Object3D>(new Object3D())

  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useFrame((state, delta) => (ref.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={hovered ? 'blue' : 'red'} />
    </mesh>
  )
}