import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/** Rounds to `digits` decimals, formatted as plain text (preserves "-0"). */
function fmt(n: number, digits: number): string {
  const rounded = +n.toFixed(digits)
  return Object.is(rounded, -0) ? '-0' : String(rounded)
}

/**
 * Exposes `window.cam` in the browser console for debugging camera state.
 * Typing `cam` prints a single plain-text line with `position` and
 * `rotation` (radians) — the exact shape Theatre.js tracks for an editable
 * `<PerspectiveCamera>` — formatted as a copy-paste-ready JS object literal
 * (unquoted keys, trailing comma) for stacking into an array by hand.
 *
 * Uses a getter so every console access reads the *current* live state.
 */
export function useCameraDebug(enabled = true, raw = false) {
  const { camera } = useThree()

  useEffect(() => {
    if (!enabled) return

    Object.defineProperty(window, 'cam', {
      get() {
        if (raw) {
          console.log('%c📷 Raw Camera Object', 'font-weight:bold;font-size:12px;color:#a855f7', camera)
          return camera
        }

        const data = {
          position: {
            x: +camera.position.x.toFixed(3),
            y: +camera.position.y.toFixed(3),
            z: +camera.position.z.toFixed(3),
          },
          rotation: {
            x: +camera.rotation.x.toFixed(4),
            y: +camera.rotation.y.toFixed(4),
            z: +camera.rotation.z.toFixed(4),
          },
        }

        console.log(
          `📷 { position: { x: ${fmt(camera.position.x, 3)}, y: ${fmt(camera.position.y, 3)}, z: ${fmt(camera.position.z, 3)} }, rotation: { x: ${fmt(camera.rotation.x, 4)}, y: ${fmt(camera.rotation.y, 4)}, z: ${fmt(camera.rotation.z, 4)} } },`,
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
  }, [camera, enabled])
}
