export const FFT_SIZE = 1024 // potencia de 2 entre 32 y 32768
export const SMOOTHING = 0.8  // 0 = sin suavizado, 1 = máximo (más suave, menos reactivo)

// Índices del array de frecuencias (depende de FFT_SIZE y sampleRate)
// Con FFT_SIZE=1024 y sampleRate=44100 → binWidth ≈ 43 Hz por bin
// FreqBin = frecuencia / (sampleRate / FFT_SIZE)
export function freqToIndex(freq: number, sampleRate: number): number {
  return Math.round(freq / (sampleRate / FFT_SIZE))
}

// Promedio de energía en un rango de índices del array FFT
export function bandAverage(data: Uint8Array, from: number, to: number): number {
  let sum = 0
  const count = to - from
  for (let i = from; i < to; i++) sum += data[i]
  return sum / count / 255 // normalizado 0–1
}
