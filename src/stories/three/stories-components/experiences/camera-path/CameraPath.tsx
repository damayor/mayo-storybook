import { Suspense } from 'react'
import { PerspectiveCamera } from '@theatre/r3f'
import { ObjRenderer } from '../../../../cpp/ObjRenderer/ObjRenderer'

export function CameraPath() {
  return (
    <>
      <PerspectiveCamera theatreKey="Camera" makeDefault fov={60} />
      <Suspense fallback={<mesh />}>
        {/* Berlin point cloud loaded via WASM C++ OBJ parser */}
        <ObjRenderer />
      </Suspense>
    </>
  )
}
