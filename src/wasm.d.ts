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

// Declaración del módulo para el archivo JS generado por Emscripten
declare module '*/obj_parser.js' {
  export interface CityParser {
    parse_obj(content: string): void;
    
    get_vertices_view(): Float32Array;
  
    delete(): void;
  }
  export interface CityParserModule {
    CityParser: new () => CityParser;
  }

  /**
   * La función por defecto es la factory generada por -s MODULARIZE=1
   */
  const cityParserModule: () => Promise<CityParserModule>;
  
  export default cityParserModule;
}

declare module '*/ply_parser.js' {
  export interface PlyParser {
    parse_mesh_a(content: string): void;
    parse_mesh_b(content: string): void;

    get_vertices_a(): Float32Array;
    get_vertices_b(): Float32Array;

    count_a(): number;
    count_b(): number;

    delete(): void;
  }

  export interface PlyParserModule {
    PlyParser: new () => PlyParser;
  }

  const plyParserModule: () => Promise<PlyParserModule>;

  export default plyParserModule;
}