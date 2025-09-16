import { Html, OrbitControls } from '@react-three/drei'
import { enablePan, enableZoom, orbitMaxPolarAngle, orbitMinPolarAngle, orbitTarget } from './controls.config'

export default function Controls() {
  return (
    <OrbitControls
      makeDefault
      enablePan={enablePan}
      enableZoom={enableZoom}
      minPolarAngle={orbitMinPolarAngle}
      maxPolarAngle={orbitMaxPolarAngle}
      target={orbitTarget}
    />
  )
}

export const renderControlsOffHelper = () => <Html className='util-controls--disabled' fullscreen />
