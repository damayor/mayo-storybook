import { useEffect, useState } from 'react'
import { EffectComposer, Noise, Scanline, ChromaticAberration, Vignette, Glitch } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { Vector2 } from 'three'
import { useControls, folder } from 'leva'
import cityParserModule from '../wasm-cpp/obj_parser.js'

interface ThreePostprocessingProps {
  noiseOpacity?: number
  scanlineDensity?: number
  vignetteOffset?: number
}

export function ThreePostprocessing({
  noiseOpacity = 0.09,
  scanlineDensity = 1.4,
  vignetteOffset = 0.28,
}: ThreePostprocessingProps) {
  const [vertices, setVertices] = useState<Float32Array | null>(null)

  const { posX, posY, posZ, rotX, rotY, rotZ, scale } = useControls({
    Transform: folder({
      posX: { value: -187, min: -500, max: 500, step: 1, label: 'Pos X' },
      posY: { value: -62,  min: -500, max: 500, step: 1, label: 'Pos Y' },
      posZ: { value: 193,  min: -500, max: 500, step: 1, label: 'Pos Z' },
      rotX: { value: -Math.PI / 2, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot X' },
      rotY: { value: 0,            min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot Y' },
      rotZ: { value: 0,            min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rot Z' },
      scale: { value: 1, min: 0.01, max: 10, step: 0.01, label: 'Scale' },
    }),
  })

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
          <pointsMaterial size={2} color="#ff00ff" sizeAttenuation={true} opacity={0.8} />
        </points>
      )}

      <EffectComposer multisampling={0}>
        <Noise
          opacity={noiseOpacity}
          blendFunction={BlendFunction.SOFT_LIGHT}
        />
        <Scanline
          blendFunction={BlendFunction.OVERLAY}
          density={scanlineDensity}
          opacity={0.25}
        />
        <ChromaticAberration
          offset={new Vector2(0.0022, 0.0)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette
          eskil={false}
          offset={vignetteOffset}
          darkness={0.85}
        />
        <Glitch
          delay={new Vector2(3, 9)}
          duration={new Vector2(0.08, 0.25)}
          strength={new Vector2(0.02, 0.06)}
          mode={GlitchMode.SPORADIC}
          active
          ratio={0.85}
        />
      </EffectComposer>
    </>
  )
}
