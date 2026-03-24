import { useRef, useState, useCallback, useEffect } from "react"
import { FFT_SIZE, freqToIndex, bandAverage, SMOOTHING } from "./audio-renderer.config"
import type {AudioBands, UseAudioAnalyzerReturn } from "./audio-renderer.types"


class BeatDetector {
  private history: number[] = []
  private historySize = 43 // ~1 segundo a 60fps
  private threshold = 1.3  // energía debe ser X veces mayor que el promedio

  detect(bassEnergy: number): boolean {
    const avg =
      this.history.length > 0
        ? this.history.reduce((a, b) => a + b, 0) / this.history.length
        : 0

    this.history.push(bassEnergy)
    if (this.history.length > this.historySize) this.history.shift()

    return bassEnergy > avg * this.threshold && bassEnergy > 0.15
  }
}

const DEFAULT_BANDS: AudioBands = {
  subBass: 0,
  bass: 0,
  mid: 0,
  high: 0,
  energy: 0,
  isBeat: false,
  raw: new Uint8Array(FFT_SIZE / 2),
}

export function useAudioAnalyzer(): UseAudioAnalyzerReturn {
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number>(0)
  const beatDetectorRef = useRef(new BeatDetector())
  const dataRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(FFT_SIZE / 2))

  const [bands, setBands] = useState<AudioBands>(DEFAULT_BANDS)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // ── Inicializar AudioContext (lazy, requiere gesto del usuario) ──
  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  // ── Loop de análisis ──
  const startLoop = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return

    const sampleRate = ctxRef.current!.sampleRate
    const subEnd = freqToIndex(60, sampleRate)
    const bassEnd = freqToIndex(250, sampleRate)
    const midEnd = freqToIndex(2000, sampleRate)
    const highEnd = freqToIndex(8000, sampleRate)

    const loop = () => {
      analyser.getByteFrequencyData(dataRef.current)

      const subBass = bandAverage(dataRef.current, 0, subEnd)
      const bass = bandAverage(dataRef.current, subEnd, bassEnd)
      const mid = bandAverage(dataRef.current, bassEnd, midEnd)
      const high = bandAverage(dataRef.current, midEnd, highEnd)
      const energy = bandAverage(dataRef.current, 0, dataRef.current.length)
      const isBeat = beatDetectorRef.current.detect(bass)

      setBands({
        subBass,
        bass,
        mid,
        high,
        energy,
        isBeat,
        raw: new Uint8Array(dataRef.current), // snapshot para render
      })

      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [])

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
  }, [])

  // ── Cargar archivo ──
  const loadFile = useCallback(
    (file: File) => {
      const ctx = ensureContext()

      // Limpiar audio anterior
      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect()
      }

      const audio = new Audio()
      audio.src = URL.createObjectURL(file)
      audio.crossOrigin = "anonymous"
      audioRef.current = audio

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration)
      })
      audio.addEventListener("ended", () => {
        setIsPlaying(false)
        stopLoop()
      })

      // Crear nodos
      const analyser = ctx.createAnalyser()
      analyser.fftSize = FFT_SIZE
      analyser.smoothingTimeConstant = SMOOTHING
      analyserRef.current = analyser

      dataRef.current = new Uint8Array(analyser.frequencyBinCount)

      const source = ctx.createMediaElementSource(audio)
      sourceRef.current = source

      source.connect(analyser)
      analyser.connect(ctx.destination) // para que el audio sea audible
    },
    [ensureContext, stopLoop]
  )

  // ── Play / Pause ──
  const play = useCallback(() => {
    if (!audioRef.current) return
    ensureContext()
    audioRef.current.play()
    setIsPlaying(true)
    startLoop()
  }, [ensureContext, startLoop])

  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
    stopLoop()
  }, [stopLoop])

  // ── Cleanup ──
  const destroy = useCallback(() => {
    stopLoop()
    if (audioRef.current) {
      audioRef.current.pause()
      URL.revokeObjectURL(audioRef.current.src)
    }
    sourceRef.current?.disconnect()
    analyserRef.current?.disconnect()
    ctxRef.current?.close()
  }, [stopLoop])

  useEffect(() => {
    return () => destroy()
  }, [destroy])

  return {
    bands,
    loadFile,
    play,
    pause,
    isPlaying,
    currentTime,
    duration,
    destroy,
  }
}