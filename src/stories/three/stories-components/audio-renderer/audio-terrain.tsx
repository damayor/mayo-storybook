import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { createNoise2D } from "simplex-noise"
import { useControls } from "leva"
import { useFrame } from "@react-three/fiber"
import type { AudioBands } from "./audio-renderer.types"

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stringToSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

const SEGMENTS = 150

// Interpolación suave entre dos valores — evita saltos bruscos
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export interface TerrainAudioProps {
  bands?: AudioBands
}

export default function Terrain({ bands }: TerrainAudioProps) {
  const meshRef = useRef<THREE.Mesh | null>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null)

  // Valores actuales interpolados (para suavizar el movimiento)
  const currentScale     = useRef(0.05)
  const currentIntensity = useRef(1.0)

  const { baseScale, baseIntensity, offsetX, offsetY, side, smoothing } = useControls("terrain", {
    // "base" = valor cuando la canción está en silencio
    baseScale:     { value: 0.03,  min: 0.001, max: 0.2,   step: 0.001, label: "scale base"     },
    baseIntensity: { value: 0.5,   min: 0,     max: 3.0,   step: 0.05,  label: "intensity base" },
    offsetX:       { value: 0,     min: -10,   max: 10,    step: 0.001  },
    offsetY:       { value: 0,     min: -10,   max: 10,    step: 0.001  },
    side:          { value: 100,   min: 10,    max: 600,   step: 1      },
    smoothing:     { value: 0.08,  min: 0.01,  max: 1.0,   step: 0.01,
                     label: "smoothing (bajo=suave)" },
  })

  // ── Geometría ─────────────────────────────────────────────────────────────
  const geoRef = useRef<THREE.PlaneGeometry>(
    new THREE.PlaneGeometry(side, side, SEGMENTS, SEGMENTS)
  )
  const basePositions = useRef<Float32Array>(new Float32Array())

  const snapshotBase = (geo: THREE.PlaneGeometry) => {
    basePositions.current = new Float32Array(geo.attributes.position.array as Float32Array)
  }

  useEffect(() => {
    const prev = geoRef.current
    const geo = new THREE.PlaneGeometry(side, side, SEGMENTS, SEGMENTS)
    geoRef.current = geo
    snapshotBase(geo)
    if (meshRef.current) meshRef.current.geometry = geo
    prev.dispose()
    return () => { if (geoRef.current === geo) geo.dispose() }
  }, [side])

  useEffect(() => { snapshotBase(geoRef.current) }, [])

  const noise2D = useMemo(() => {
    const rng = mulberry32(stringToSeed("my-seed"))
    return createNoise2D(rng)
  }, [])

  // Refs para Leva (sin stale closures en useFrame)
  const baseScaleRef     = useRef(baseScale)
  const baseIntensityRef = useRef(baseIntensity)
  const offsetXRef       = useRef(offsetX)
  const offsetYRef       = useRef(offsetY)
  const smoothingRef     = useRef(smoothing)

  useEffect(() => { baseScaleRef.current     = baseScale     }, [baseScale])
  useEffect(() => { baseIntensityRef.current = baseIntensity }, [baseIntensity])
  useEffect(() => { offsetXRef.current       = offsetX       }, [offsetX])
  useEffect(() => { offsetYRef.current       = offsetY       }, [offsetY])
  useEffect(() => { smoothingRef.current     = smoothing     }, [smoothing])

  // ── useFrame ──────────────────────────────────────────────────────────────
  useFrame(() => {
    const geo = geoRef.current
    const base = basePositions.current
    if (!geo || !base.length) return

    let targetScale     = baseScaleRef.current
    let targetIntensity = baseIntensityRef.current

    if (bands) {
      // Piano de Robert Miles vive en mid (250–2kHz)
      // mid  → scale:     0.01 (notas graves/lentas) … 0.20 (notas agudas/rápidas)
      // mid  → intensity: sube las montañas con la melodía
      // energy → amplifica todo el rango

      const mid    = bands.mid        // 0–1
      const energy = bands.energy     // 0–1
      const high   = bands.high       // brillo del piano

      // Scale: va de baseScale hasta 0.20 guiado por mid + high
      targetScale = baseScaleRef.current + (mid * 0.15) + (high * 0.04)
      targetScale = Math.min(0.20, Math.max(0.01, targetScale))

      // Intensity: va de baseIntensity hasta ~3.0 con la melodía
      // energy da el volumen general, mid da la forma de la melodía
      targetIntensity = baseIntensityRef.current
        + (mid    * 2.0)   // melodía → altura principal
        + (energy * 0.8)   // volumen general → sube todo un poco
      targetIntensity = Math.min(3.0, Math.max(0, targetIntensity))
    }

    // Interpolación suave hacia el target (evita saltos bruscos)
    currentScale.current     = lerp(currentScale.current,     targetScale,     smoothingRef.current)
    currentIntensity.current = lerp(currentIntensity.current, targetIntensity, smoothingRef.current)

    // Deformar vértices
    const posAttr = geo.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const ox = offsetXRef.current
    const oy = offsetYRef.current
    const s  = currentScale.current
    const iv = currentIntensity.current

    for (let i = 0; i < posAttr.count; i++) {
      const ix = i * 3
      arr[ix + 2] = noise2D(base[ix] * s + ox, base[ix + 1] * s + oy) * iv
    }

    posAttr.needsUpdate = true
    geo.computeVertexNormals()

    // Color: azul frío en silencio → verde brillante en picos de melodía
    if (materialRef.current && bands) {
      const e = bands.energy
      const m = bands.mid
      materialRef.current.color.setRGB(
        0.05 + m * 0.3,          // R: toque cálido en melodía
        0.35 + e * 0.5,          // G: sube con la energía
        0.4  - m * 0.3,          // B: azul frío en silencio
      )
    }
  })

  return (
    <group>          
    <directionalLight position={[10, 10, 5]} intensity={baseIntensity} />
    <mesh
      ref={meshRef}
      geometry={geoRef.current}
      rotation-x={-Math.PI / 2}
    >
      <meshStandardMaterial
        ref={materialRef}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
    </group>

  )
}