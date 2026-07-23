# Testing WebXR Hello World

## On Android (real device — recommended)

1. Run `pnpm storybook` — the server must be on HTTPS (configured in Task 1).
2. Find your local IP: run `ip a` (Linux/WSL) or `ipconfig` (Windows).
3. Open Chrome on your Android phone and go to: `https://<your-local-ip>:6006`
4. Accept the self-signed certificate warning

#bug after running ipconfig and get
Wireless LAN adapter Wi-Fi:

Connection-specific DNS Suffix . :
Link-local IPv6 Address . . . . . : fe80::736b:1530:ca33:484%17
IPv4 Address. . . . . . . . . . . : 192.168.28.42
Subnet Mask . . . . . . . . . . . : 255.255.255.0
Default Gateway . . . . . . . . . : 192.168.28.1

It's not connected from the cellphone...

5. Navigate to: Three → Experiences → XR → Hello World
6. Tap "Enter VR" — Chrome will launch the immersive VR session.

## On Desktop (built-in emulator)

1. **Disable** the Immersive Web Emulator Chrome extension (it overrides WebXR and blocks the built-in emulator).
2. Open Storybook in Chrome, navigate to Three → Experiences → XR → Hello World.
3. A floating control panel from `@react-three/xr` will appear on the page.
4. Click "Enter VR" — the built-in emulator simulates a Meta Quest 3 session.
5. Use the on-screen controls to move/rotate the virtual headset.

## On iOS

WebXR VR is **not supported** on iOS Safari as of 2025. Use Android for real device testing.

## Troubleshooting

- "Enter VR" button does nothing → the page is not on HTTPS. Check Vite config.
- "VR not supported" message → your device/browser doesn't support WebXR. Use Android Chrome 79+.
- Built-in emulator does not appear → the Immersive Web Emulator extension is still active — disable it.
