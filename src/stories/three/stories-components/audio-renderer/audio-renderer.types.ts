export interface AudioBands {
  /** 20–60 Hz  — kick drum, sub rumble. Mueve todo el terreno verticalmente */
  subBass: number
  /** 60–250 Hz — bajo, bombo. Ideal para ondas lentas y el scale del terreno */
  bass: number
  /** 250–2k Hz — voces, guitarras, piano. Detalle medio del terreno */
  mid: number
  /** 2k–8k Hz  — presencia, brillo. Rugosidad superficial */
  high: number
  /** Energía total promedio (0–1). Para color, metalness, etc. */
  energy: number
  /** true en el frame donde se detecta un beat (bajada de bass fuerte) */
  isBeat: boolean
  /** Raw FFT data completo, por si quieres hacer algo custom */
  raw: Uint8Array
}

export interface UseAudioAnalyzerReturn {
  /** Bands actualizadas cada frame (via requestAnimationFrame) */
  bands: AudioBands
  /** Cargar un archivo MP3/WAV desde <input type="file"> */
  loadFile: (file: File) => void
  /** Play / Pause */
  play: () => void
  pause: () => void
  isPlaying: boolean
  /** 0–1 */
  currentTime: number
  duration: number
  /** Destruye el contexto de audio — llama en cleanup */
  destroy: () => void
}