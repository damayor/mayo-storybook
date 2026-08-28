# Portfolio Tasks — August

## Task 1

[ ] Loading page para el portafolio: no mostrar el contenido hasta que `CameraPathBackground` haya terminado de cargar el modelo 3D.

En mobile la carga del modelo tarda ~6s y durante ese tiempo se ve la página sin la interacción de fondo lista, lo cual se ve incompleto/roto.

Idea: mostrar un loading screen (spinner o algo simple con el logo) mientras el modelo 3D carga, y hacer fade-in al portafolio una vez el background esté listo. Revisar si `CameraPathBackground` (o el `ObjRenderer`/WASM parser que consume) ya expone algún callback/estado de "modelo cargado" para engancharlo.

## Task 2

[ ] Brainstorm: interacción con el acelerómetro/giroscopio del celular para mover la cámara

En desktop existe `MouseTrail`/parallax con el cursor, pero en mobile no hay cursor. La idea es que al mover/inclinar el celular, se detecte ese movimiento (DeviceOrientation API / DeviceMotion API) y se aplique un pequeño desplazamiento a la cámara, similar al parallax de mouse.

Puntos a investigar:
- `DeviceOrientationEvent` / `DeviceMotionEvent` — soporte por navegador.
- Cómo mapear los valores de orientación (alpha/beta/gamma) a un movimiento sutil de cámara sin marear ni sentirse invasivo.
- Reusar la lógica de `useMouseParallax` como base, pero con una fuente de input distinta para mobile.

**iOS fuera de scope por ahora**: Safari/iOS requiere pedir permiso explícito vía `DeviceOrientationEvent.requestPermission()` (gesto del usuario + HTTPS), lo cual complica la implementación inicial. Web no tiene un equivalente directo a `#if UNITY_ANDROID` de Unity (compilación condicional nativa) — el gate debe hacerse en runtime, detectando la plataforma vía `navigator.userAgent` (o `navigator.userAgentData.platform` donde esté disponible) y solo activando la lógica de acelerómetro cuando se detecte Android. En iOS, el fallback debe ser no activar esta interacción (comportamiento actual sin cambios).

No implementar todavía — solo dejar la idea documentada para evaluar viabilidad/esfuerzo.

## Task 3

[ ] Story "Hola Mundo" en WebGPU + comparativa vs WebGL

Objetivo: no es una feature grande, es una story simple para dejar demostrado el conocimiento del término WebGPU, sus ventajas, y capacidad de programar sobre él. Alcance chico, no hay que sobre-invertir.

**Contexto (para no reinvestigar):**

- three.js `0.180.0` (versión instalada en este repo) **ya soporta WebGPU de forma nativa** vía `WebGPURenderer`, importable desde `three/webgpu`. Ya no es experimental/aparte — es parte del build estándar desde la v0.160+ aprox, y usa el nuevo sistema de nodos (TSL — Three.js Shading Language) para materiales y shaders en vez de GLSL crudo.
- `WebGPURenderer` hace fallback automático a WebGL2 si el navegador no soporta WebGPU (chequea `navigator.gpu`), así que es seguro usarlo en producción sin romper compatibilidad.
- Ventajas reales de WebGPU sobre WebGL (para mencionar en la doc de la story):
  - **Compute shaders** en el navegador (WebGL no los tiene) — permite simulaciones (partículas, física, fluidos) corriendo en GPU sin trucos de render-to-texture.
  - **Menor overhead de CPU / mejor multi-threading**: la API está diseñada para grabar comandos en paralelo (command buffers), a diferencia del modelo de estado global de WebGL que serializa todo.
  - **Mejor uso de GPUs modernas**: mapea más directo a Vulkan/Metal/DirectX 12 (pipelines explícitos, menos validación implícita en cada draw call).
  - **Shaders más expresivos**: TSL permite escribir "shaders" en JS/TS con nodos componibles, en vez de strings de GLSL.
  - Contras/trade-offs a mencionar también: soporte de navegador todavía no universal (Safari lo habilitó recientemente, algunos navegadores/dispositivos viejos no lo tienen), y el ecosistema de debugging/tooling es menos maduro que WebGL.

### Sub-actividades

- [x] 3.1 — Crear componente `WebGPUHelloWorld` bajo `src/stories/three/` (cubo o esfera simple rotando, similar a un "hello world" de R3F) usando `WebGPURenderer` de `three/webgpu` + nodos TSL para el material, en vez del pipeline WebGL clásico.
  - **Investigado — sí funciona con R3F, no hace falta canvas imperativo.** `@react-three/fiber@9.3.0` (instalado) tipa el prop `gl` de `<Canvas>` como `GLProps = Renderer | ((defaultProps) => Renderer) | ((defaultProps) => Promise<Renderer>) | Partial<...>`. Soporta oficialmente una función **async** que devuelva el renderer, que es justo lo que pide `WebGPURenderer` (requiere `await renderer.init()` antes de usarse, a diferencia de `WebGLRenderer` que es síncrono). Patrón:
    ```tsx
    import { WebGPURenderer } from 'three/webgpu';

    <Canvas gl={async (props) => {
      const renderer = new WebGPURenderer({ canvas: props.canvas as HTMLCanvasElement });
      await renderer.init();
      return renderer;
    }}>
    ```
  - No se reutiliza `MayoCanvas`: no expone el prop `gl` hacia afuera, y trae `SceneEnvironment`/luces pensadas para el pipeline WebGL clásico (compatibilidad con materiales de nodos TSL no garantizada). Se usa un `<Canvas>` propio en el componente, siguiendo el patrón de `animated-sun` pero sin pasar por `MayoCanvas`.
  - `three@0.180.0` expone `three/webgpu` (renderer) y `three/tsl` (nodos: `color`, `uniform`, materiales de nodos como `MeshBasicNodeMaterial`) como entry points ya declarados en su `package.json` — confirmado en `node_modules`.
  - **Implementado y verificado en navegador** (Playwright, `pnpm storybook` en :6007): story `ThreeJs/Native/WebGPUHelloWorld` — `src/stories/three/stories-components/webgpu-hello-world/`. Cubo rotando con color animado vía nodo `mix(color, color, uniform)` de TSL, badge de backend activo en la esquina. 0 errores de consola. En el entorno de prueba (sandbox sin GPU passthrough) `WebGPURenderer` no encontró adapter y cayó a WebGL2 correctamente — confirma que el fallback automático funciona como se documentó arriba. Bug detectado y corregido en el camino: la detección de backend inicialmente usaba `navigator.gpu` (falso positivo, existe aunque `requestAdapter()` falle); se corrigió a leer `renderer.backend.isWebGPUBackend` **después** de `renderer.init()`, que refleja el backend real ya resuelto.
- [x] 3.2 — Detección de soporte: mostrar un mensaje/badge si `navigator.gpu` no existe (fallback a WebGL), para que la story documente el estado real del navegador del visitante.
  - Cubierto como parte de la 3.1: el badge de `WebGPUHelloWorld` ya lee `renderer.backend.isWebGPUBackend` tras `init()` y muestra "backend: WebGPU ✅" o "backend: WebGL (fallback) ⚠️" según el resultado real (no solo la presencia de `navigator.gpu`, que puede dar falso positivo si `requestAdapter()` falla). Verificado en navegador mostrando el estado de fallback correctamente.
- [x] 3.3 — Story comparativa `WebGPU vs WebGL`: misma escena (mismo mesh, misma cantidad de objetos) renderizada dos veces lado a lado o con un toggle, mostrando:
  - FPS en tiempo real (usar `stats.js` o un contador simple con `useFrame`/`requestAnimationFrame`).
  - Un badge indicando qué backend está activo en cada panel.
  - Opcional (si da tiempo): un caso con muchos objetos/partículas para que la diferencia de rendimiento sea visible, no solo teórica.
  - **Implementado y verificado**: story `ThreeJs/Native/WebGPUvsWebGL` — `src/stories/three/stories-components/webgpu-vs-webgl/`. Dos paneles lado a lado con N cubos instanciados (`InstancedMesh`, default 4000) rotando individualmente en CPU cada frame; contador de FPS propio con `useFrame` (no se agregó `stats.js`/`r3f-perf` como dependencia); badge de backend real por panel; `cubeCount` expuesto como slider de Storybook (100–20000).
  - **Decisión clave**: ambos paneles usan el **mismo `WebGPURenderer`**, cambiando solo `forceWebGL: true|false`. Es más honesto para la comparativa (mismo renderer, mismo código, única variable = backend) y evita un bug que costó rato encontrar: construir un `THREE.WebGLRenderer` a mano y pasárselo a R3F vía `gl` deja el **viewport en el default de WebGL (300×150)** aunque el canvas sea 452×600 — R3F llama `setSize()` pero three.js no reaplica el viewport cuando el canvas se le pasa ya creado, así que el panel renderizaba en una esquina del framebuffer y se veía completamente vacío (alpha=0). `WebGPURenderer` maneja ese caso internamente y no sufre el problema.
  - Nota para probar de verdad la diferencia: en un entorno sin GPU (headless/sandbox) `WebGPURenderer` no encuentra adapter y **ambos** paneles caen a WebGL2, mostrando FPS iguales. Hay que abrirlo en un navegador con WebGPU real para que el panel izquierdo diga `webgpu` y la comparación tenga sentido.
- [ ] 3.4 — Documentación de la story (MDX o `parameters.docs`) explicando en 3-4 bullets qué es WebGPU, sus ventajas sobre WebGL, y que three.js ya lo soporta nativamente vía `WebGPURenderer`/TSL. Enlazar la story comparativa.
- [ ] 3.5 — (Fallback si `WebGPURenderer` de three.js da demasiada fricción con R3F/MayoCanvas) Hacer el "Hola Mundo" con **WebGPU puro en JavaScript** (sin three.js), como story HTML bajo `src/stories/html/` o similar:
  - Pedir adapter/device: `navigator.gpu.requestAdapter()` → `adapter.requestDevice()`.
  - Configurar un `GPUCanvasContext` (`canvas.getContext('webgpu')`).
  - Escribir un shader mínimo en **WGSL** (el lenguaje de shaders de WebGPU, no GLSL) que pinte un triángulo o limpie el canvas con un color animado.
  - Crear el render pipeline y grabar el render pass en cada frame.
  - Esto sirve como plan B y además demuestra conocimiento de la API "cruda", no solo a través de three.js.

---

## Notes for Claude

- Este archivo es solo para tareas del portafolio (no Storybook stories) — ver `TASKS-storybook.md` para ese scope.
