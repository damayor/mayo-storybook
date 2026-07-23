# Portfolio Background — Polish & Bug Tasks

> Scored on a 1–5 scale for **priority** (5 = most important) and **difficulty**
> (5 = hardest). Use `priority - difficulty` as a rough "quick win" signal —
> higher is better bang for the buck.

## Overview

| # | Task | Priority | Difficulty | Quick-win score | Status |
|---|------|:---:|:---:|:---:|---|
| 1 | Readability of foreground content over PLY background | 5 | 3 | +2 | ✅ Done |
| 2 | Soften CameraPath scroll start/end easing | 4 | 3 | +1 | ✅ Done |
| 3 | Softer MouseParallax movement on CameraPath | 4 | 2 | +2 | ✅ Done |
| 4 | `ThreePostprocessingEffects` inconsistent/broken in CameraPath | 3 | 5 | -2 | Not started |
| 5a | CameraPath framing should match real viewport (no dark edges) | 4 | 3 | +1 | 🔜 Up next |
| 5b | Parametrize camera distance to PLY model on large screens | 3 | 4 | -1 | 🔜 Up next (after 5a) |

---

## Task 1 — Foreground readability over the PLY point cloud

**Priority 5 · Difficulty 3**

The portfolio text/content is hard to read because the Berlin PLY point
cloud renders directly behind it with no separation. See `image.png`
(hero section: "DAVID MAYORGA-HERRERA" title sits directly on dense point
cloud lines).

- [x] Add a background treatment behind text/content blocks — avoid hard-edged
      opaque panels; prefer a soft, borderless gradient/blur so it still reads
      as part of the point-cloud scene.
- [x] Consider `backdrop-filter: blur(...)` panels with a radial/linear
      gradient fade instead of a solid rectangle — no visible defined border.
- [ ] Check contrast in both `light` and `dark` DaisyUI themes. (only verified
      in dark theme so far — portfolio always renders `data-theme="dark"`, so
      low priority)

**Implementation:** `src/components/soft-panel/soft-panel-component.tsx` —
shared `SoftPanel` component: `backdrop-filter: blur(28px)` + a radial-gradient
`mask-image` (`ellipse 70% 70%`, black→40%, transparent→90%) so the blur/fill
fades out before it forms a hard rectangular edge. Applied behind every
heading/content block in `portfolio.component.tsx` (Home, About, Contact,
both Projects headings) and the Skills section heading in
`skills-panel-component.tsx`.

**Follow-up fixes (iterated against screenshots):**
- Mask tuning went through three passes before landing back on the original
  soft values (`ellipse 70% 70%`, black→40%, transparent→90%) — a tighter
  mask (`ellipse 95% 95%`, black→60%, transparent→100%) fixed edge-fading but
  looked like a hard "squared" card, which defeated the point of a borderless
  panel. Kept the soft mask and fixed edge-fading structurally instead (below).
- **About section, horizontal:** dense paragraph text reached close enough to
  the panel edge that the mask fade ate into line-start/line-end letters.
  Fixed by widening the *panel* (`max-w-7xl`) while keeping the *text column*
  narrower (`max-w-3xl mx-auto`) inside it — the fade now lives in the margin
  between panel edge and text, not on the text itself. (First pass used
  `max-w-6xl` / `max-w-2xl`, which fixed the fading but made the text column
  uncomfortably narrow/tall; widened both together to `7xl`/`3xl` to keep the
  same margin ratio with a roomier column.)
- **About section, vertical:** same fade issue existed top/bottom, just less
  visible. Widened the vertical buffer too: `py-10 sm:py-16` → `py-16 sm:py-24`.
- **Heading pills** (Projects ×2, Skills — single-line headings that can't be
  narrowed like a paragraph column): the pill's own box was barely bigger than
  its text (`px-10 py-4`), so almost the whole pill sat inside the mask's fade
  zone. Fixed by making the pill deliberately larger than its content:
  `px-10 py-4` → `px-16 py-8 sm:px-24 sm:py-12`.
- Home and Contact panels weren't reported as unreadable, so left as-is —
  same technique (wider panel / narrower or padded content) applies there too
  if they turn out to need it.

**Bonus fix (found while in this file):** both `Mail` icon links (Sidebar +
Contact section) were wired to `contactData.behance` instead of an email
action — copy-paste leftover. Now `mailto:david@mayinteractive.io`.

---

## Task 2 — Elastic scroll start/end on CameraPath

**Priority 4 · Difficulty 3**

Camera movement is abrupt at the very start and very end of the scroll
sequence. It should ease in/out more like the existing `useMouseParallax`
lerp-based damping rather than a hard linear mapping.

- [x] Review scroll → `sheet.sequence.position` mapping in `CameraPath.tsx`
      (`ScrollSyncNative` / `page` mode — `wheel` mode no longer exists in the
      current code, CLAUDE.md is stale on that point).
- [x] Add easing (lerp toward target progress instead of setting position
      directly) so the first/last few percent of scroll feel elastic instead
      of snapping.
- [x] Verify both `scrollMode` variants (`native`, `page`) still stay in sync
      with Theatre.js keyframes after the change.

**Implementation:** added `SCROLL_LERP = 0.1` in `CameraPath.tsx`. Both
`ScrollSyncNative` and `ScrollSyncPage` now ease a `positionRef` toward
`scroll.offset * SEQUENCE_DURATION` / `progressRef.current * SEQUENCE_DURATION`
each frame instead of assigning `sheet.sequence.position` directly — same
lerp-toward-target technique as `useMouseParallax`.

**Likely files:**
`src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx`

---

## Task 3 — Softer MouseParallax on CameraPath

**Priority 4 · Difficulty 2**

The mouse parallax applied to the CameraPath mesh group feels stronger /
less smooth than intended. Tune `lerp` and `strength` options.

- [x] Reduce `strength` and/or lower `lerp` in the `useMouseParallax` call
      inside `CameraPath.tsx` for a subtler tilt.
- [x] Compare side-by-side with the `three/Postprocessing/MouseParallax`
      story to confirm the feel is consistent (or intentionally softer) across
      both usages.

**Root cause found:** `useMouseParallax.ts` had `STRENGTH_DEFAULT = 0.12`,
but its own doc comment (and the `MouseParallax` story's Leva control
description: "~0.012 = subtle, ~0.15 = dramatic") say the intended default is
`0.012` — a 10× bug. `CameraPath.tsx` calls the hook with no explicit
`strength`, so it was silently inheriting "dramatic" instead of "subtle."
Fixed the constant to `0.012`. The `MouseParallax` story is unaffected since
it always passes explicit `lerp`/`strength` from its own controls.

**Likely files:**
`src/stories/three/non-stories-components/hooks/useMouseParallax.ts`,
`src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx`

---

## Task 4 — `ThreePostprocessingEffects` unreliable inside CameraPath

**Priority 3 · Difficulty 5**

`ThreePostprocessingEffects` works reliably in the standalone story
(`/story/three-postprocessing--default`) but is flaky when composed inside
`CameraPath`'s `EffectComposer` — sometimes effects don't render at all, and
behavior is inconsistent across reloads.

- [ ] Confirm there is truly only **one** `<EffectComposer>` in the tree at
      runtime (per the single-EffectComposer rule in `CLAUDE.md`) — check for
      remounts/StrictMode double-invocation causing a transient second
      instance.
- [ ] Check effect/pass ordering and whether `ThreePostprocessingEffects` and
      `MouseWarpEffectPass` are both children of the same composer with
      stable keys (React key churn can cause effects to silently drop).
- [ ] Check if this correlates with `USE_MOUSE_WARP` flag state — cross-check
      against the known `MouseWarpEffect` bug already logged in
      `TASKS-theatre.md` ("Bug 2 — MouseWarpEffect never working").
      Related: [MouseWarpEffect.ts](src/stories/three/non-stories-components/effects/MouseWarpEffect.ts),
      [MouseWarpPass.tsx](src/stories/three/non-stories-components/effects/MouseWarpPass.tsx).
- [ ] Add a visual diagnostic (e.g. force an obvious effect value) to
      determine if it's a mount-order race vs. a uniform/ref issue.

**Likely files:**
`src/stories/three/stories-components/postprocessing/ThreePostprocessing.tsx`,
`src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx`,
`src/stories/three/non-stories-components/effects/MouseWarpPass.tsx`

---

## Task 5 — No dark/empty edges around the PLY mesh

**Priority 5a: 4 · Difficulty 3** / **5b: 3 · Difficulty 4**

Background should always read as an unbounded, borderless mesh — never show
dark empty space at the edges, especially on wide/large screens where the
camera FOV reveals more than the point cloud covers. See `image.png` /
`image.png` (small viewport vs. wide viewport comparisons).

**Status update:** `theatreState.json` keyframes were re-recorded/enhanced by
hand (outside this task list) as groundwork. Open question carried over from
that session: whether the camera should sit measurably closer to the PLY
model specifically on larger screens — this is exactly what 5b covers below.
5a should land first since 5b's distance correction depends on knowing the
real viewport aspect ratio from 5a.

### 5a — Frame the scene to actual viewport dimensions

- [ ] Refactor `CameraPath` (via `CameraPathBackground.tsx`) so FOV/camera
      framing is computed from the real browser viewport aspect ratio used by
      the portfolio background, not a fixed assumption.
- [ ] Test at common breakpoints (mobile portrait, tablet, ultra-wide
      desktop) to confirm no dark corners appear.

### 5b — Parametrize camera-to-model distance for large screens

- [ ] Add a function that adjusts camera distance/zoom relative to
      viewport width/aspect ratio — pull the camera closer to the PLY model on
      larger/wider screens so the point cloud still fills the frame.
- [ ] Decide whether this adjusts the Theatre.js sequence values at runtime
      or applies a post-Theatre.js corrective offset (avoid fighting
      Theatre.js keyframes directly).

**Likely files:**
`src/components/camera-path-background/CameraPathBackground.tsx`,
`src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx`

---

## Notes for Claude

- Respect the single-`EffectComposer`-per-canvas rule from `CLAUDE.md` at all
  times — Task 4 in particular must not introduce a second one while
  debugging.
- Do not add vertex shader distortion to `ObjRenderer` — that remains a
  focused WASM demo per existing project convention.
- Test changes in both the CameraPath Storybook story and the actual
  portfolio (`pnpm dev`) since `scrollMode` differs between the two contexts.
