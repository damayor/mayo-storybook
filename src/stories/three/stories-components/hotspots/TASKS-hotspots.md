# Hotspots — estado y decisiones de diseño

> Experiencia de hotspots sobre producto 3D: zapatilla + pines anclados al mesh +
> modal con imagen/texto + cámara que orbita hasta encuadrar el pin.
>
> **Estado: funciona de punta a punta — pines, modal, viaje de cámara esférico,
> cierre al orbitar. La línea del modal SIGUE sin apuntar al pin real** (mismo
> problema que antes, ver §2) — pendiente, no bloqueante para el demo.

---

## 1. Arquitectura actual

```
ProductWithHotspots (product-with-hotspots.tsx)
  ├─ useGLTF(HOTSPOTS_SHOE_URL)  carga el mesh (fijo, no parametrizable)
  ├─ <primitive>                 producto QUIETO, en pose de presentación (RIGHT)
  ├─ useHotspotsData()           fetch del JSON mock desde public/ (ruta fija)
  └─ Hotspots (hotspots.tsx)
       ├─ getHotspotPositions()  lee los pines `hotspotN` en espacio de mundo
       ├─ useSpring              ANIMA LA CÁMARA — interpola ÁNGULOS esféricos
       ├─ listener 'start'       orbitar (usuario) cierra el modal
       ├─ HotspotButton[]        botones <Html occlude>
       ├─ HotspotDebugCubes      cubos clicables, solo si `debugShowPinCubes`
       └─ HotspotContent         modal + línea SVG (decorativa, ver §2)
```

Una sola story (`ThreeJs/Experiences/Hotspots → Hotspots`), un solo componente
de producto. `hotspots.tsx` sigue sin saber nada de zapatos: recibe un
`scene: Group` cualquiera: `ProductWithHotspots` es el único orquestador del
caso concreto (zapato adidas, vista RIGHT fija).

**El producto ya NO rota nunca.** Se intentó (girarlo en Y para encarar cada
pin a la cámara) y no funcionaba: ver §3.8.

---

## 2. ⚠️ La línea del modal sigue sin apuntar al hotspot

> Mismo diagnóstico que en la versión anterior de este documento. No se ha
> tocado desde entonces — sigue pendiente.

**La línea SVG del modal no tiene ninguna relación con la escena 3D.** Mira
[hotspot-content.config.ts](hotspot-content/hotspot-content.config.ts):

```ts
export const drawContentPointer = (pointsLeft, pointerTop, pointerLeft) => {
  const vertex2X = pointerLeft + (pointsLeft ? -xOffsetLimit : xOffsetLimit);
  return `M0 0 L${vertex2X} 0 L${vertex2X} ${pointerTop} L${pointerLeft} ${pointerTop}`;
};
```

Y en [hotspot-content.tsx](hotspot-content/hotspot-content.tsx):

```ts
pointerLeft = contentRef.current.offsetLeft + imgBorderAndPadding;
pointerTop = contentRef.current.offsetTop + contentRef.current.offsetHeight / 2;
```

Son `offsetLeft`/`offsetTop` **del propio modal** — decoración del modal
consigo mismo. No lee la cámara ni la posición del pin.

### Qué haría falta de verdad

Proyectar el pin a píxeles del canvas y pasárselo al SVG. El propio
[hotspots.config.ts](hotspots.config.ts) ya trae la función que hace esa
proyección — `projectToCanvas()` — usada hoy solo para depurar por consola
(§5). El trabajo pendiente es cablearla al `drawContentPointer` en vez de a
`console.log`:

```ts
const { x, y } = projectToCanvas(pinWorldPosition, camera, size);
// y que drawContentPointer termine en (x, y), no en offsetLeft/offsetTop
```

Coste real: el trazo se anima con `stroke-dasharray`/`stroke-dashoffset`, que
se reinicia en cada recálculo, así que hay que separar "geometría del path" de
"animación de entrada". Y el modal tendría que reposicionarse para no tapar el
pin, abandonando los `vw`/`vh` fijos por esquina de `hotspot-content.css`.

---

## 3. Bugs resueltos (para no repetirlos)

### 3.8 El producto no rotaba al seleccionar un hotspot ⭐ (llevó a rediseñar la cámara)

Se intentó, primero, plantar el zapato quieto y **rotarlo** en Y para encarar
cada pin a la cámara: `getRotationToFaceCamera(pin, product, camera, rotY)`
medía el ángulo del pin respecto al centro de giro y sumaba la diferencia.

**No rotaba — o rotaba un movimiento mínimo.** Causa: `getHotspotPositions()`
lee `getWorldPosition()` sobre el `<primitive>` que **ya tiene** la rotación
del frame anterior aplicada. El ángulo medido salía siempre ya alineado con el
estado actual, así que `cameraAngle − pinAngle ≈ 0` — el cálculo se cancelaba
solo, frame tras frame.

→ Se abandonó rotar el producto. El producto quedó fijo (`<primitive>` con
`rotation` estática) y es la **cámara** la que se mueve — no lee el estado que
está intentando corregir.

### 3.9 La cámara se acercaba al zapato a mitad de viaje ⭐

Primera versión del viaje de cámara: interpolar la **posición** de la cámara
en línea recta entre el punto actual y el destino (`from: {position}`,
`to: {position}`).

Una recta entre dos puntos de una esfera **atraviesa la esfera** — a mitad de
camino la cámara queda más cerca del centro que en cualquiera de los extremos.
Se veía como un zoom-in no pedido a mitad de la animación.

Segunda causa, apilada sobre la primera: `controls.update()` se llamaba en
cada frame del viaje. OrbitControls recalcula la posición desde su **propio**
estado esférico interno, que no se había enterado del spring — los dos
escribían sobre `camera.position` peleándose.

→ Arreglo (ver [hotspots.config.ts](hotspots.config.ts)):
`getSphericalAnglesFacingPin()` da los ángulos del destino; el spring
interpola **theta y phi** (no posiciones) con el **radio congelado** en
`orbitRadiusRef` — la cámara recorre la superficie de la esfera, distancia
constante de principio a fin. `controls.update()` se llama **una sola vez**,
en `onRest`, para que OrbitControls reabsorba la posición final.

`shortestAngleDelta()` evita además que el giro dé la vuelta larga al cruzar
±π (de 350° a 10° son 20°, no 340°).

### 3.10 El viaje de cámara se cerraba a sí mismo

El propio spring que mueve la cámara dispara el evento `'start'` de
OrbitControls — el mismo evento que se usa para detectar "el usuario está
orbitando, cierra el modal" (ver §4). Sin distinguir ambos casos, el modal se
cerraba en el instante en que empezaba a abrirse.

→ `isAnimatingRef`: el handler de `'start'` ignora el evento mientras el
propio spring está en marcha.

### 3.0–3.7 (heredados de la arquitectura anterior — mover-cámara con ángulo simple)

Se conservan por referencia aunque la implementación cambió (ver §3.9 para la
versión vigente del viaje de cámara):

- **Doble escalado de los botones**: `getHotspotPositions()` devuelve
  posiciones en espacio de mundo (con el `scale` del `<primitive>` ya
  aplicado); un `<group scale={...}>` extra alrededor de los botones las
  multiplicaba otra vez. → El group de hotspots nunca escala.
- **Cámara orbitando el origen en vez del target**: mismo síntoma que §3.9
  pero por otra causa (coordenadas absolutas en vez de relativas al target).
- **Closure obsoleto en `useSpring`**: `useSpring(() => ({...}))` sin deps
  captura el `controls` del primer render (`undefined`, drei aún no lo
  registró). Regla que sigue aplicando: nada dentro de un `useSpring` sin deps
  debe leer una variable de render directamente — usar refs.
- **`getHotspotPositions` solo miraba hijos directos**: cambiado a
  `traverse()` + `updateMatrixWorld(true)`.
- **La línea SVG desaparecía al segundo**: `animation-fill-mode: backwards` →
  `both`.
- `hotspotsClaude.tsx` (283 líneas duplicadas), `hotspots_legacy.tsx` y la
  carpeta `product-hostposts/` (typo, con su propia story duplicada) —
  borrados. Ver §6.

---

## 4. Cierre del modal al orbitar

Comportamiento actual, decidido explícitamente (no es el diseño original):

- El modal solo se muestra cuando el viaje de cámara terminó y el pin está
  centrado (`isPinCentered`, seteado en `onRest` del spring).
- **Cualquier interacción del usuario con OrbitControls** (drag, rueda, pinch)
  dispara `'start'` → cierra el modal y deselecciona (`selectedIndex = -1`).
  No hay tolerancia a micro-movimientos: es un cierre inmediato.
- **Deseleccionar no devuelve la cámara a una vista por defecto.** Si el
  usuario cierra el modal orbitando, la cámara se queda donde el usuario la
  dejó — moverla de vuelta sería un movimiento que no pidió.

---

## 5. Herramienta de depuración: `debugShowPinCubes`

Control de la story (default `false`). Activa
[HotspotDebugCubes](hotspot-debug-cubes.tsx): un cubo real y clicable sobre
cada posición que `getHotspotPositions()` calculó (no sobre el empty original
del GLB — sobre el número que la experiencia usa de verdad).

Al clicar un cubo, imprime por consola posición 3D, proyección en píxeles
(`projectToCanvas()`), y la desviación respecto al centro del canvas. Además,
al terminar cada viaje de cámara se loguea automáticamente la desviación del
pin seleccionado — sirve para verificar que el encuadre esférico da ~0px sin
tener que clicar nada.

Los empties originales del GLB se dejan **siempre** ocultos (aunque
`debugShowPinCubes` esté activo) para no pintar dos cosas en el mismo sitio.

---

## 6. Cambios de superficie (props, código muerto)

Recorte deliberado de la API pública, con lo eliminado y por qué:

| Antes | Ahora |
| --- | --- |
| `glbUrl` parametrizable | Fijo: `HOTSPOTS_SHOE_URL` |
| `cameraView` parametrizable | Fijo: `FootwearViews.RIGHT`, producto no rota |
| `zoomDistance` | Eliminado junto con el sistema de ángulo simple (§3.9) |
| `contentTextWidth` | Fijo: `CONTENT_TEXT_WIDTH = 350` en el config |
| `showContent` | Eliminado — el modal siempre se muestra si hay contenido |
| `hotspotsDataUrl` parametrizable | Fijo — `useHotspotsData()` sin argumento |
| `imageSize: number` (px) | `'S' \| 'M' \| 'L'` — mapa `IMAGE_SIZES` |
| Dos stories (`Hotspots`/`HotspotsPDP`) | Una sola: `Hotspots` |
| `ProductHotspots` en `product-hostposts/` (typo) | `ProductWithHotspots` en `hotspots/product-with-hotspots.tsx` |
| `HotspotsConfigType.customButton` | Eliminado — sin caller real en ningún sitio |
| `HotspotContentProps.customContent` | Eliminado — sin caller real en ningún sitio |
| `hotspots/constants/scene-constants.ts` | Borrado — sus 4 exports sin uso (duplicaban, con otro valor, los de `helpers/constants/scene-constants.ts`) |

CSS muerto eliminado junto con lo anterior: `.hotspot-button--custom`,
`.hotspot-content__text--custom`, `.hotspot-content--story-container`,
`.hotspot-button--story-container`, y el `html { font-size: 16px }` (10px en
móvil) que reescalaba el documento entero desde el CSS de este componente.

---

## 7. Datos y assets

### 7.1 El modelo y el contenido son independientes

**`meshIndex` NO es un mapeo 1:1.** El GLB puede traer más pines que entradas
de datos; solo se renderiza un botón cuando existen ambos.

|                                    |                                         |
| ---------------------------------- | --------------------------------------- |
| Pines en `HotspotsShoe.glb`        | `hotspot1` … `hotspot8` (8)             |
| Entradas en `hotspots.json`  | 3 (`meshIndex` 4, 6, 8)                 |
| Botones renderizados por defecto   | 3                                       |
| Con `showOrphanPins: true`         | 8 (los 5 sin contenido salen marcados)  |

`Hotspots` avisa por consola de ambos desajustes (pines sin contenido, y
`meshIndex` sin pin en el GLB).

### 7.2 Rutas (todo servido desde `public/`)

| Asset     | Ruta                                             |
| --------- | ------------------------------------------------ |
| Mesh      | `public/assets/meshes/HotspotsShoe.glb` (3.3 MB) |
| Contenido | `public/assets/hotspots/hotspots.json`     |

El JSON se carga por fetch
([useHotspotsData.ts](../../non-stories-components/hooks/useHotspotsData.ts)),
fuera del bundle. Ya no acepta URL por parámetro (§6) — es mock fijo, a
propósito: esto es un demo, no un cliente configurable.

### 7.3 Contenido — adidas ZX Alkyne (FX6229)

| `meshIndex` | Zona  | Header                         |
| ----------- | ----- | ------------------------------ |
| 4           | suela | Boost Midsole & Rubber Outsole |
| 6           | talón | TPU Heel Cage                  |
| 8           | punta | Breathable Mesh Toe            |

**Riesgo sin resolver:** las 3 imágenes son URLs externas del CDN de adidas.
Si adidas las rota o bloquea hot-linking, el modal sale sin imagen (hay un
`--default` en CSS). Pendiente: descargarlas a `public/assets/hotspots/`.

---

## 8. Controls de Storybook (story única)

| Control               | Rango / opciones             | Qué hace                                                    |
| ---------------------- | ----------------------------- | ------------------------------------------------------------ |
| `scale`                | 1–20                          | Escala del producto y los pines                              |
| `hotspotOffset`        | 1.0–1.5                       | Separa el botón de la superficie                              |
| `indexLabel`           | `none` / `inside` / `badge`   | Muestra el `meshIndex` en el botón                            |
| `showOrphanPins`       | bool                          | Revela pines sin contenido                                    |
| `debugShowPinCubes`    | bool (default `false`)        | Cubos clicables + log de posición/desviación (§5)             |
| `modalAnchor`          | 4 esquinas                    | Ancla del modal y dirección de la línea (decorativa, §2)      |
| `imageSize`            | `S` / `M` / `L`               | Tamaño de la miniatura del modal                               |
| `transitionDuration`   | 200–3000 ms                   | Duración del viaje de cámara                                  |

---

## 9. Pendientes

- [ ] **La línea del modal no señala el hotspot** — sigue siendo el trabajo de
      fondo pendiente. Ver §2: `projectToCanvas()` ya existe y hace la cuenta
      correcta (se usa hoy solo para depurar); falta cablearla a
      `drawContentPointer` y resolver el reinicio de la animación del trazo.
- [ ] **`hotspot1` está en `(0,0,0)`** — único pin del GLB sin `translation`.
      Su botón cae en el centro del zapato. Se arregla en Blender, no en
      código.
- [ ] Descargar las 3 imágenes del CDN de adidas a `public/assets/hotspots/`
      (riesgo de hot-linking roto, §7.3).
- [ ] Contenido para los 5 pines sin datos (1, 2, 3, 5, 7), o limpiarlos del
      GLB.
- [ ] Verificación visual: confirmada ya en navegador real por el usuario
      (WSL2 sin WebGL impide verificar desde este entorno — usar
      `debugShowPinCubes` + consola, o pedir captura).
