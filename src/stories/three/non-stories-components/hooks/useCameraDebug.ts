import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { MathUtils } from 'three'

/**
 * Exposes `window.cam` in the browser console for debugging camera state.
 * Typing `cam` prints position, distance, rotation (deg), quaternion,
 * and a copy-paste ready `overrideCameraPos` value for MayoCanvas.
 *
 * Uses a getter so every console access reads the *current* live state.
 */
export function useCameraDebug(enabled = true, raw = false) {
  const { camera, controls } = useThree()

  useEffect(() => {
    if (!enabled) return

    Object.defineProperty(window, 'cam', {
      get() {
        if (raw) {
          console.log('%c📷 Raw Camera Object', 'font-weight:bold;font-size:12px;color:#a855f7')
          console.log(camera)
          return camera
        }

        const pos = camera.position
        const orbitTarget = (controls as any)?.target

        const data = {
          position: {
            x: +pos.x.toFixed(3),
            y: +pos.y.toFixed(3),
            z: +pos.z.toFixed(3),
          },
          distance: {
            fromOrigin: +pos.length().toFixed(3),
            ...(orbitTarget && { fromTarget: +pos.distanceTo(orbitTarget).toFixed(3) }),
          },
          rotation: {
            x: +camera.rotation.x.toFixed(2),
            y: +camera.rotation.y.toFixed(2),
            z: +camera.rotation.z.toFixed(2),
          },
          rotation_deg: {
            x: +MathUtils.radToDeg(camera.rotation.x).toFixed(2),
            y: +MathUtils.radToDeg(camera.rotation.y).toFixed(2),
            z: +MathUtils.radToDeg(camera.rotation.z).toFixed(2),
          },
          quaternion: {
            x: +camera.quaternion.x.toFixed(4),
            y: +camera.quaternion.y.toFixed(4),
            z: +camera.quaternion.z.toFixed(4),
            w: +camera.quaternion.w.toFixed(4),
          },
          overrideCameraPos: [
            +pos.x.toFixed(3),
            +pos.y.toFixed(3),
            +pos.z.toFixed(3),
          ] as [number, number, number],
        }

        console.log('%c📷 Camera State', 'font-weight:bold;font-size:12px;color:#a855f7')
        console.log('  position      :', data.position)
        console.log('  distance      :', data.distance)
        console.log('  rotation (rad):', data.rotation)
        console.log('  rotation (deg):', data.rotation_deg)
        console.log('  quaternion    :', data.quaternion)
        console.log(
          '  overrideCameraPos:',
          `[${data.overrideCameraPos.join(', ')}]`,
        )

        return data
      },
      configurable: true,
    })

    return () => {
      try {
        delete (window as any).cam
      } catch {}
    }
  }, [camera, controls, enabled])
}
