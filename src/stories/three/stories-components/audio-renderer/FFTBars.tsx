import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { AudioBands } from "./audio-renderer.types"

interface FFTBarsProps {
  bands: AudioBands
  /** Cuántas barras mostrar del array FFT (máx 512 con FFT_SIZE=1024) */
  barCount?: number
  /** Ancho total del espectro */
  width?: number
  /** Altura máxima de las barras */
  maxHeight?: number
}

// Una barra individual — instanced para performance
function FFTBars({ bands, barCount = 128, width = 40, maxHeight = 10 }: FFTBarsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useRef(new THREE.Object3D())
  const colorRef = useRef(new THREE.Color())

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh || !bands.raw.length) return

    const raw = bands.raw
    const step = Math.floor(raw.length / barCount)
    const barWidth = width / barCount
    const gap = barWidth * 0.15

    for (let i = 0; i < barCount; i++) {
      // Valor FFT normalizado 0–1
      const value = raw[i * step] / 255

      const x = (i / barCount) * width - width / 2 + barWidth / 2
      const h = Math.max(0.05, value * maxHeight)

      dummy.current.position.set(x, h / 2, 0)
      dummy.current.scale.set(barWidth - gap, h, barWidth - gap)
      dummy.current.updateMatrix()
      mesh.setMatrixAt(i, dummy.current.matrix)

      // Color: graves rojos → agudos azules, con brillo según energía
      const hue = (1 - i / barCount) * 0.72 // 0.72=azul → 0=rojo
      const sat = 0.8 + bands.energy * 0.2
      const light = 0.35 + value * 0.4
      colorRef.current.setHSL(hue, sat, light)
      mesh.setColorAt(i, colorRef.current)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, barCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        toneMapped={false}
        metalness={0.3}
        roughness={0.4}
      />
    </instancedMesh>
  )
}

export default FFTBars