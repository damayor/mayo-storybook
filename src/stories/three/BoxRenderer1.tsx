import React from 'react';


export default function BoxRenderer(props: any) {

  return (
    <mesh
      {...props}
      scale={1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'red'} />
    </mesh>
  )
}