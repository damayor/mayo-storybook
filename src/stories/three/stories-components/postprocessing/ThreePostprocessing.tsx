import { useEffect, useState } from 'react'
import { EffectComposer, Noise, Scanline, ChromaticAberration, Vignette, Glitch } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { Vector2 } from 'three'
// import { useControls, folder } from 'leva'
import cityParserModule from '../wasm-cpp/obj_parser.js'
import { useCameraDebug } from '../../non-stories-components/hooks/useCameraDebug.js'

// --- Mesh transform defaults (extracted from useControls) ---
const posX  = -187
const posY  = -62
const posZ  = 193
const rotX  = -Math.PI / 2
const rotY  = 0
const rotZ  = 0
const scale = 1

interface ThreePostprocessingProps {
  // Noise
  noiseOpacity?: number
  // Scanline
  scanlineDensity?: number
  scanlineOpacity?: number
  // Chromatic Aberration
  chromaticOffsetX?: number
  chromaticOffsetY?: number
  // Vignette
  vignetteOffset?: number
  vignetteDarkness?: number
  // Glitch
  glitchDelayMin?: number
  glitchDelayMax?: number
  glitchDurationMin?: number
  glitchDurationMax?: number
  glitchStrengthMin?: number
  glitchStrengthMax?: number
  glitchRatio?: number
}

export function ThreePostprocessing({
  noiseOpacity      = 0.09,
  scanlineDensity   = 1.4,
  scanlineOpacity   = 0.25,
  chromaticOffsetX  = 0.0022,
  chromaticOffsetY  = 0.0,
  vignetteOffset    = 0.28,
  vignetteDarkness  = 0.85,
  glitchDelayMin    = 3,
  glitchDelayMax    = 9,
  glitchDurationMin = 0.08,
  glitchDurationMax = 0.25,
  glitchStrengthMin = 0.02,
  glitchStrengthMax = 0.06,
  glitchRatio       = 0.85,
}: ThreePostprocessingProps) {
  const [vertices, setVertices] = useState<Float32Array | null>(null)
  useCameraDebug()

  // const { posX, posY, posZ, rotX, rotY, rotZ, scale } = useControls({
  //   Transform: folder({
  //     posX:  { value: -187,          min: -500,      max: 500,      step: 1,    label: 'Pos X' },
  //     posY:  { value: -62,           min: -500,      max: 500,      step: 1,    label: 'Pos Y' },
  //     posZ:  { value: 193,           min: -500,      max: 500,      step: 1,    label: 'Pos Z' },
  //     rotX:  { value: -Math.PI / 2,  min: -Math.PI,  max: Math.PI,  step: 0.01, label: 'Rot X' },
  //     rotY:  { value: 0,             min: -Math.PI,  max: Math.PI,  step: 0.01, label: 'Rot Y' },
  //     rotZ:  { value: 0,             min: -Math.PI,  max: Math.PI,  step: 0.01, label: 'Rot Z' },
  //     scale: { value: 1,             min: 0.01,      max: 10,       step: 0.01, label: 'Scale' },
  //   }),
  // })

  useEffect(() => {
    async function loadCityData() {
      const response = await fetch('/assets/meshes/mesh_berlin/Mesh_3894_58196_-002.obj')
      const objText = await response.text()

      const instance = await cityParserModule()
      const parser = new instance.CityParser()

      parser.parse_obj(objText)

      const view = parser.get_vertices_view()
      setVertices(new Float32Array(view))

      parser.delete()
    }

    loadCityData()
  }, [])

  return (
    <>
      {vertices && (
        <points position={[posX, posY, posZ]} rotation={[rotX, rotY, rotZ]} scale={scale}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={vertices.length / 3}
              args={[vertices, 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.5} color="#ffffff" sizeAttenuation={true} opacity={0.8} />
        </points>
      )}

      <EffectComposer multisampling={0}>
        {/* Adds film grain / random pixel noise over the whole image */}
        <Noise
          opacity={noiseOpacity}
          blendFunction={BlendFunction.SOFT_LIGHT}
        />
        {/* Simulates CRT horizontal scan lines */}
        <Scanline
          blendFunction={BlendFunction.OVERLAY}
          density={scanlineDensity}
          opacity={scanlineOpacity}
        />
        {/* Shifts RGB channels horizontally — creates a color-fringe lens distortion */}
        <ChromaticAberration
          offset={new Vector2(chromaticOffsetX, chromaticOffsetY)}
          radialModulation={false}
          modulationOffset={0}
        />
        {/* Darkens screen edges to draw focus toward the centre */}
        <Vignette
          eskil={false}
          offset={vignetteOffset}
          darkness={vignetteDarkness}
        />
        {/* Randomly corrupts horizontal blocks of pixels, like a broken video signal */}
        <Glitch
          delay={new Vector2(glitchDelayMin, glitchDelayMax)}
          duration={new Vector2(glitchDurationMin, glitchDurationMax)}
          strength={new Vector2(glitchStrengthMin, glitchStrengthMax)}
          mode={GlitchMode.SPORADIC}
          active
          ratio={glitchRatio}
        />
      </EffectComposer>
    </>
  )
}
