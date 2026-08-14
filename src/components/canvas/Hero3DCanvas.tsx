"use client";

import { useEffect, useRef } from "react";

export default function Hero3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes for 3D constellation simulation
    const particleCount = 65;
    const particles: {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      color: string;
    }[] = [];

    const colors = ["#74B4D9", "#10367D", "#1d52b5", "#a5d5f2"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 400 + 50,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) * 0.05;
      mouseY = (e.clientY - rect.top - height / 2) * 0.05;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angle += 0.002;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const projectedParticles: { px: number; py: number; scale: number; color: string; radius: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particles
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;
        if (p.z < 50) p.z = 450;
        if (p.z > 450) p.z = 50;

        // 3D rotation with mouse offset
        const rotX = p.x * cosA - p.z * sinA + mouseX;
        const rotZ = p.z * cosA + p.x * sinA;
        const rotY = p.y + mouseY;

        // Perspective projection (FOV 300)
        const scale = 300 / (300 + rotZ);
        const px = rotX * scale + width / 2;
        const py = rotY * scale + height / 2;

        if (scale > 0 && px > -50 && px < width + 50 && py > -50 && py < height + 50) {
          projectedParticles.push({
            px,
            py,
            scale,
            color: p.color,
            radius: p.radius * scale,
          });
        }
      }

      // Draw constellation network lines between nearby projected particles
      for (let i = 0; i < projectedParticles.length; i++) {
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p1 = projectedParticles[i];
          const p2 = projectedParticles[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.25 * p1.scale;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(116, 180, 217, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw glowing nodes
      for (let i = 0; i < projectedParticles.length; i++) {
        const p = projectedParticles[i];
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(p.radius, 1), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#74B4D9";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-65"
    />
  );
}
