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

---

## Notes for Claude

- Este archivo es solo para tareas del portafolio (no Storybook stories) — ver `TASKS-storybook.md` para ese scope.
