import { useEffect, useRef } from "react"
import { useAudioAnalyzer } from "./useAudioAnalyzer"
import { Html } from "@react-three/drei"
import FFTBars from "./FFTBars"
import AudioTerrain from "./audio-terrain"

export default function AudioInTerrainRender() {


  const { bands, loadFile, play, pause, isPlaying } = useAudioAnalyzer()

  const SONG_IN_TERRAIN = "/assets/audio/fable.mp3"

  // En un useEffect, después de montar:
  useEffect(() => {
    fetch(SONG_IN_TERRAIN)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], "fable.mp3", { type: "audio/mpeg" })
        loadFile(file)
      })
  }, [])

  return (
    <group>
      <Html position={[-1, -1, 0]} center as='div'>
        <button className="p-2 bg-amber-600" onClick={isPlaying ? pause : play}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </Html>

      <group position={[0, 0, -10]}>

        <AudioTerrain
          bands={bands}
          // bassIntensityStrength={0.6}
          // beatPulse={1.8}
        />

        <FFTBars bands={bands} barCount={128} width={40} maxHeight={8} />
      </group>

      {/* Play al primer click en el canvas */}
      {/* {!isPlaying && (
        <mesh position={[0, 0, 0]} onClick={play}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )} */}
    </group>

  )
}