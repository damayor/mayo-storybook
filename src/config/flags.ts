// Feature flags — driven by Vite env vars so they can differ per environment.
//
// Dev:     .env (or .env.development) — values apply when running `pnpm dev`
// Staging: .env.staging               — activated with `pnpm build --mode staging`
// Prod:    .env.production             — activated with `pnpm build`
//
// All vars must be prefixed VITE_ to be exposed to client code.
// Default (false) when the var is not set.

export const flags = {
  USE_CAMERA_PATH_BG: import.meta.env.VITE_USE_CAMERA_PATH_BG === 'true',
  USE_MOUSE_WARP:     import.meta.env.VITE_USE_MOUSE_WARP     === 'true',
} as const
