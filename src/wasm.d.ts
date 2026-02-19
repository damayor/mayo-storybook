declare module '*/wave_gen.js' {
  export interface WasmModuleInstance {
    WaveGenerator: new () => {
      updateVertices: (count: number, time: number) => any;
    };
    // Aquí puedes agregar otros métodos que exportes en C++
  }

  // El export por defecto es la función que inicializa el módulo
  const initWasm: () => Promise<WasmModuleInstance>;
  export default initWasm;
}