import { useTranslation } from 'react-i18next';

interface LoaderProps {
  label?: string;
}

// Two thick arcs counter-rotating around the same center — a modern "loading ring".

function DualRingIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="#bd457a"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="70 80"
        style={{
          animation: 'loader-ring-spin-cw 1.4s linear infinite',
          transformOrigin: '32px 32px',
        }}
      />
      <circle
        cx="32"
        cy="32"
        r="16"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="46 55"
        style={{
          animation: 'loader-ring-spin-ccw 1s linear infinite',
          transformOrigin: '32px 32px',
        }}
      />
      <style>{`
        @keyframes loader-ring-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes loader-ring-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </svg>
  );
}

// Three orbit rings standing in for the X/Y/Z axes, each tilted to read as a distinct
// plane and spinning at its own speed — nods to the R3F scene behind the loader.

function AxisSpinnerIcon() {
  const axes = [
    { className: 'stroke-camelot-700', baseRotate: 0, duration: '1.1s', dash: '75 30' },
    { className: 'stroke-purple-500', baseRotate: 80, duration: '1.4s', dash: '75 30' },
    { className: 'stroke-white', baseRotate: 135, duration: '1.9s', dash: '75 30' },
  ];

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className="w-[20vw] h-[20vw] max-w-[320px] max-h-[320px]"
    >
      {axes.map((axis) => (
        // Static wrapper sets the tilt; only the inner group animates, so the
        // CSS animation's transform never fights an inline transform for the property.
        <g key={axis.className} style={{ transform: `rotate(${axis.baseRotate}deg)`, transformOrigin: '32px 32px' }}>
          <g
            style={{
              animation: `loader-axis-spin ${axis.duration} linear infinite`,
              transformOrigin: '32px 32px',
            }}
          >
            <ellipse
              cx="32"
              cy="32"
              rx="26"
              ry="10"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray={axis.dash}
              className={axis.className}
            />
          </g>
        </g>
      ))}
      <style>{`
        @keyframes loader-axis-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

export function Loader({ label }: LoaderProps) {
  const { t } = useTranslation();
  const text = label ?? t('loader.label', 'Compiling ideas…');

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black"
      role="status"
      aria-label={text}
    >
      {/* <CompassIcon /> */}
      {/* <DualRingIcon /> */}
      <AxisSpinnerIcon />

      <span className="text-sm tracking-widest uppercase text-white/70 font-lato">{text}</span>
    </div>
  );
}

export default Loader;
