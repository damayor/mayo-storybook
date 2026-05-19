# WebXR Research Tasks

## Bug fixes

### [ ] Fix canvas height in xr-hello-world
The canvas does not fill the full viewport height inside Storybook.
`styles.css` targets `#root` but Storybook mounts stories inside `#storybook-root`, so the height rule has no effect.
Fix: remove the `styles.css` import from `AppXR.tsx` and replace the `<>` fragment root with an explicit container:
```tsx
<div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
```
Same pattern already used in `xr-6/XRHelloWorld.tsx`.

---

## Research

### [ ] Test stereo VR on a real Android device over local IP

Goal: confirm the scene renders correctly in split-screen stereo mode on a physical phone.

**Steps**
1. Find your local machine IP — in WSL run `ip route show default | awk '{print $3}'` or check Windows with `ipconfig`.
2. Make sure Storybook is running with HTTPS (`pnpm storybook` — `basicSsl` is already in the Vite config).
3. Open Chrome on Android and navigate to `https://<your-ip>:6006`.
4. Accept the self-signed certificate warning (tap "Advanced → Proceed").
5. Navigate to **XR → Experiences → Hello Drei-VR**.
6. Tap **Enter VR** — Chrome opens an immersive WebXR session.
7. Insert the phone into a Cardboard-style headset to see stereo split.

**Known limitations**
- iOS Safari does not support WebXR VR as of 2025 — Android Chrome 79+ only.
- "Enter VR" does nothing → page is not HTTPS or device doesn't support WebXR.
- "VR not supported" → use Android Chrome, not a WebView or Firefox.

**current Bugs 
After running ipconfig and get
Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::736b:1530:ca33:484%17
   IPv4 Address. . . . . . . . . . . : 192.168.28.42
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.28.1

It's not connected from the cellphone on the link https://192.168.28.42:6006/iframe.html?globals=&args=&id=xr-pmndrs-xr-v6--hello-world&viewMode=story

Or in WSL 
ip route
default via 172.17.16.1 dev eth0 proto kernel
172.17.16.0/20 dev eth0 proto kernel scope link src 172.17.21.238

It's not connected from the cellphone on the link https://172.17.16.1:6006/iframe.html?globals=&args=&id=xr-pmndrs-xr-v6--hello-world&viewMode=story

---

## Cleanup

### [ ] Remove xr-6 story
`xr-6/XRHelloWorld.tsx` is a stripped-down version of `AppXR.tsx` — no Sky, no Floor, no hover, no Text label.
`xr-6/reference.tsx` is a dead standalone entry point (`createRoot` inside — not a component).
Neither adds value over `xr-hello-world`. Delete the entire `xr-6/` folder.
The useful documentation from `xr-6/README.md` is preserved above in the mobile testing task.

---

## Future experiments

- **Teleportation** — `useXRControllerLocomotion` or a custom raycaster-based teleport target
- **Spatial UI panels** — floating HTML-like menus using `@react-three/drei` `<Html>` inside XR
- **Hand tracking** — swap `Controllers` for `Hands` and detect pinch gestures via `useXRInputSourceState`
- **Physics in VR** — integrate `@react-three/rapier` with grabbable rigid bodies
- **Spatial audio** — positional `AudioListener` + `PositionalAudio` tied to controller position
