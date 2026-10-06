'use client';

import React, { useEffect, useRef } from 'react';

interface LaserPointerCanvasProps {
  isActive: boolean;
}

interface Point {
  x: number;
  y: number;
  alpha: number;
}

export const LaserPointerCanvas: React.FC<LaserPointerCanvasProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailRef = useRef<Point[]>([]);
  const currentPos = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      currentPos.current = { x, y };
      trailRef.current.push({ x, y, alpha: 1.0 });
      if (trailRef.current.length > 25) {
        trailRef.current.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw laser trail
      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        p.alpha *= 0.88;

        if (p.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, 8 * (i / trailRef.current.length)), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.4})`; // Emerald laser glow
          ctx.fill();
        }
      }

      // Draw active laser dot
      if (currentPos.current) {
        const { x, y } = currentPos.current;

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.9)');
        gradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.4)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
    />
  );
};
