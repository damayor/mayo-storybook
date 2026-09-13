# TASKS: Potree Point Cloud Renderer in Storybook

## Goal
Render a real LAS/LAZ point cloud (converted to Potree's octree format) inside a
React Three Fiber `<Canvas>`, as a new Storybook story, using an existing
Potree-compatible loader instead of reimplementing the octree/LOD system.

## Stack context (from package.json)
- React 19, `@react-three/fiber` 9.3.0, `@react-three/drei` 10.7.5
- `three` 0.180.0 (recent — this is the main risk, see below)
- TypeScript, Vite 5, Storybook 9.1.5 (`@storybook/react-vite`)
- No existing point-cloud or LAZ dependency in the project yet

## ⚠️ Compatibility risk to check FIRST (30 min, do not skip)
`potree-loader` and `@pnext/three-loader` are both older packages, last built
against three.js versions well behind 0.180.0. The `potree-loader` README
itself warns about "THREE being imported twice." Before writing any story
code:

- [x] Install the candidate loader in isolation and check its `three` peer
      dependency / bundled version
- [x] Confirm it doesn't pull its own copy of `three` (duplicate THREE
      instances break `instanceof` checks and drei helpers silently)
- [x] If it conflicts: try `npm dedupe`, or alias `three` in `vite.config.ts`
      to force a single instance, before falling back to patching the
      library's source locally — **not needed**, single instance out of the box
- [x] Decide go/no-go on the library here. **GO.**

### Outcome (differs from the assumptions above)
- **Chose `@pnext/three-loader@1.0.0`, not `potree-loader`.** The task file had
  these backwards: pnext shipped v1.0.0 in Nov 2025 *with* PotreeConverter 2.x
  support (`loading2/load-octree`), while `potree-loader` is untouched since
  May 2022 and lists `vite@^2.8.6` as a **runtime** dependency.
- **No duplicate THREE.** pnpm resolves a single `three@0.180.0`; the loader
  declares three as a peer dep and bundles no copy.
- **The `three: ~0.160.0` peer pin is stale, not a real break.** Scanned the
  built bundle for every API removed in 0.160→0.180 (`outputEncoding`,
  `sRGBEncoding`, `useLegacyLights`, legacy `Geometry`, …): zero hits. It uses
  only `BufferGeometry`/`InstancedBufferGeometry` and declares `GLSL3` shaders.
  Installs with a peer warning only; verified working in the browser.
- Loader also exposes a `v1` path (`cloud.js`) via `new Potree('v1')` — useful
  fallback, since most public sample clouds are still Potree 1.x.

## Phase 1 — Data and converter (do outside the repo)
- [x] Download a small real LAS/LAZ tile — used `lion_takanawa.copc.laz`
      (LAS 1.4, point format 7 w/ RGB, 341,989 points, 2.7 MB)
- [x] Download PotreeConverter 2.x binaries — ran the Windows build via WSL
      (note: Releases ship **Windows binaries only**; Linux requires a source
      build with cmake)
- [x] Run `PotreeConverter <input>.laz -o ./converted` and confirm it
      produces `metadata.json`, `octree.bin`, `hierarchy.bin`
- [x] Copy the `converted/` folder into
      `public/assets/meshes/pointclouds/lion_takanawa/`

Conversion was lossless: **341,989 points in → 341,989 out**, zero warnings in
`log.txt`. Octree depth 3, root spacing 0.0444, bbox 5.69³ units.

## Phase 2 — Dependency install
- [x] ~~`npm i potree-loader`~~ → `pnpm add @pnext/three-loader` (see the
      compatibility outcome above for why the swap)
- [x] Re-run the compatibility check with the real package in the real project

## Phase 3 — Core R3F component
- [x] Create `potree-cloud/potree-cloud.tsx` (folder-per-component, matching
      the repo's existing convention rather than a bare file)
- [x] Component holds a `Potree` manager (`useMemo`, created once) and a
      `pointClouds: PointCloudOctree[]` array in a ref
- [x] On mount, `potree.loadPointCloud('metadata.json', rel => baseUrl + rel)`
      and render via `<primitive object={pco} />`
- [x] Set `potree.pointBudget` (exposed as a story arg, default 1M)
- [x] `useFrame(() => potree.updatePointClouds(clouds, camera, gl))`

**Verified the LOD actually streams:** the network tab shows `metadata.json` →
`hierarchy.bin` → ~48 *partial Range requests* against `octree.bin` (423 B to
553 KB each). The 14 MB file is never downloaded whole.

Used `new Potree('v2')` — the constructor takes `'v1' | 'v2'` to pick between
the `cloud.js` and `metadata.json` loaders.

## Phase 4 — Camera and controls
- [x] Center `OrbitControls` target on the cloud's bounding box once loaded
- [x] Set `camera.near` / `camera.far` from the bounding sphere radius
- [x] Verify up-axis — this scan **is** Z-up, so `zUp` defaults to true and
      applies `rotation-x = -90°`

Two non-obvious bugs fixed here:
- `OrbitControls` publishes itself to the R3F store on a *later* render than
  the one that resolves the cloud, so the framing effect must wait for
  `controls` to exist — otherwise controls snap the camera back to its own
  target on the next `update()`.
- `new Box3().setFromObject(pco)` is unreliable right after load (nodes are
  still streaming, geometry may be empty). Use `pco.boundingBox` from the
  metadata instead, and `localToWorld` the center so the Z-up rotation is
  accounted for.

## Phase 5 — Storybook story
- [x] Create `potree-cloud.stories.tsx`
- [x] Controls for `pointBudget`, `pointSize`, `pointSizeType`, `pointShape`,
      `pointColorType`, `enableLod` toggle, `zUp`, `baseUrl`
- [x] Confirm Vite serves the `.bin` files untransformed (it does — `public/`
      is copied as-is, and Range requests work in dev)

Three stories: `LionTakanawa` (RGB), `LodDebugView` (colored by octree depth,
which makes the LOD structure visible), `LowPointBudget` (starved budget so
the cloud stays coarse — shows the budget doing its job).

## Dataset note — the holes in the lion's back are in the source data
Missing patches on the statue's back are **not** a renderer or converter bug.
Evidence:
- Point count is identical before and after conversion (341,989 → 341,989),
  and `log.txt` reports no discarded points.
- Splitting the converted points into 8 slabs front-to-back gives
  `15144 / 13211 / 41030 / 28235 / 10876 / 11504 / 0 / 0` — **the rear quarter
  of the bounding box contains literally zero points.**
- Only 3.8% of a 16³ occupancy grid is filled, which is the signature of a
  thin captured *surface*, not a solid volume.

This is normal terrestrial LiDAR/photogrammetry: the scanner only records
surfaces with line-of-sight from where it stood. Occluded areas (behind the
back, under the chin, inside foliage) produce permanent gaps. Filling them
needs either more scan positions or mesh reconstruction (e.g. Poisson) — not
a viewer setting.

## Phase 6 — Polish (optional, only if time allows)
- [ ] Loading state / progress indicator while the octree streams in
- [ ] Point color by intensity or classification if the LAS file has that
      attribute
- [ ] Basic EDL (eye-dome lighting) shader pass for depth perception, via
      `postprocessing` (already in devDependencies) — stretch goal

## Sources
- PotreeConverter releases: https://github.com/potree/PotreeConverter/releases
- Potree viewer (architecture reference only): https://github.com/potree/potree
- potree-loader (PotreeConverter 2.x compatible): https://www.npmjs.com/package/potree-loader
- @pnext/three-loader (older cloud.js format): https://github.com/pnext/three-loader
- copc.js (fallback LAZ reader if the loader library fails compatibility check): https://github.com/hobu/copc.js
- OpenTopography (sample LAS/LAZ data): https://opentopography.org
- USGS 3DEP (sample LAS/LAZ data): https://www.usgs.gov/3d-elevation-program