import { useRef, useEffect } from 'react';

// Componente para el efecto de trail del cursor
function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface TrailPoint {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }

    const trail: TrailPoint[] = [];
    const maxTrailLength = 20;

    const handleMouseMove = (e: MouseEvent) => {
      trail.push({
        x: e.clientX,
        y: e.clientY,
        vx: 0,
        vy: 0,
        life: 1,
      });

      if (trail.length > maxTrailLength) {
        trail.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar trail
      trail.forEach((point, index) => {
        const size = point.life * 15 * (index / trail.length);
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${point.life * 0.8})`);
        gradient.addColorStop(0.5, `rgba(79, 70, 229, ${point.life * 0.4})`);
        gradient.addColorStop(1, `rgba(139, 92, 246, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Decaer la vida
        point.life *= 0.95;
      });

      // Limpiar puntos muertos
      for (let i = trail.length - 1; i >= 0; i--) {
        if (trail[i].life < 0.01) {
          trail.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

export default CursorTrail;
