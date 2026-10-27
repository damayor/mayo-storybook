import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  onLoaded?: () => void;
}

// Same smoothing as ScrollSyncPage in CameraPath: ease toward the scroll target.
const SCROLL_LERP = 0.1;
// Skip seeks smaller than this (seconds) — avoids hammering the decoder with no-op seeks.
const MIN_SEEK = 0.02;

// Mobile replacement for CameraPathBackground: a pre-rendered all-intra video
// (see scripts/render-bg-video.mjs) scrubbed by page scroll instead of the live point-cloud scene.
export function VideoBackground({ onLoaded }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let progress = 0;
    let current = 0;
    let raf = 0;

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max > 0) progress = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const tick = () => {
      if (video.duration && !video.seeking) {
        current += (progress - current) * SCROLL_LERP;
        const target = current * video.duration;
        if (Math.abs(video.currentTime - target) > MIN_SEEK) video.currentTime = target;
      }
      raf = requestAnimationFrame(tick);
    };

    const onReady = () => {
      onLoadedRef.current?.();
      // iOS only allows seeking a never-played video after a play/pause "unlock".
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
      onScroll();
      raf = requestAnimationFrame(tick);
    };

    video.addEventListener('loadeddata', onReady, { once: true });
    if (video.readyState >= 2) onReady();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      video.removeEventListener('loadeddata', onReady);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <video
        ref={videoRef}
        src="/assets/video/bg-mobile.mp4"
        poster="/assets/video/bg-mobile-poster.jpg"
        muted
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#111111' }}
      />
    </div>
  );
}

export default VideoBackground;
