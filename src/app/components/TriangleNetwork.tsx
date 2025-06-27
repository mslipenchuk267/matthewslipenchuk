'use client';
import { useRef, useEffect } from 'react';

export default function TriangleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /* ────────── BASIC SETUP ────────── */
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    /* detect coarse pointers (most phones / tablets) */
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    /* retina-proof sizing */
    const dpr = window.devicePixelRatio || 1;
    function resizeCanvas() {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;

      ctx.setTransform(1, 0, 0, 1, 0, 0);  

      canvas.style.width  = cssW + 'px';
      canvas.style.height = cssH + 'px';
      canvas.width  = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.scale(dpr, dpr);             // draw in CSS pixel units
      width  = cssW;
      height = cssH;
    }

    let width = 0, height = 0;
    resizeCanvas();

    /* ────────── CONFIG ────────── */
    const NODE_COUNT = isMobile ? 30 : 80;   // half as many on mobile
    const LINK_DIST  = 140;
    const BREAK_DIST = 180;
    const DEGREE_CAP = 3;

    const ACCEL     = 150;                    // lower kick feels smoother ★ changed
    const FRICTION  = 0.98;                   // < 1 = gradual slowing   ★ changed
    const SPEED_CAP = 220;                    // less frantic top speed  ★ changed

    /* ────────── NODES ────────── */
    interface Node { x: number; y: number; vx: number; vy: number }
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    }));

    /* ────────── EDGE STATE ────────── */
    let prevEdges = new Set<string>();
    const linkDistSq  = LINK_DIST  * LINK_DIST;
    const breakDistSq = BREAK_DIST * BREAK_DIST;
    const key = (i: number, j: number) => (i < j ? `${i}-${j}` : `${j}-${i}`);

    const torusDiff = (d: number, size: number) =>
      d >  size / 2 ? d - size :
      d < -size / 2 ? d + size : d;

    /* ────────── MAIN LOOP ────────── */
    let last = performance.now();

    function animate(now: number) {
      const dt = (now - last) / 1000;
      last = now;

      ctx.clearRect(0, 0, width, height);

      /* 1. move nodes */
      for (const n of nodes) {
        n.vx += (Math.random() - 0.5) * ACCEL * dt;
        n.vy += (Math.random() - 0.5) * ACCEL * dt;

        n.vx *= FRICTION;
        n.vy *= FRICTION;

        const s = Math.hypot(n.vx, n.vy);
        if (s > SPEED_CAP) {
          n.vx = (n.vx / s) * SPEED_CAP;
          n.vy = (n.vy / s) * SPEED_CAP;
        }

        n.x = (n.x + n.vx * dt + width)  % width;
        n.y = (n.y + n.vy * dt + height) % height;
      }

      /* 2. compute edges */
      const degree = new Array(NODE_COUNT).fill(0);
      const edges: { i: number; dx: number; dy: number; d: number }[] = [];
      const nextEdges = new Set<string>();

      // keep previous edges if still within BREAK_DIST
      for (const id of prevEdges) {
        const [iStr, jStr] = id.split('-');
        const i = +iStr, j = +jStr;
        const a = nodes[i], b = nodes[j];
        const dx = torusDiff(a.x - b.x, width);
        const dy = torusDiff(a.y - b.y, height);
        const d2 = dx*dx + dy*dy;

        if (d2 <= breakDistSq && degree[i] < DEGREE_CAP && degree[j] < DEGREE_CAP) {
          const d = Math.sqrt(d2);
          degree[i]++; degree[j]++;
          edges.push({ i, dx, dy, d });
          nextEdges.add(id);
        }
      }

      // add new edges
      const cand: { i: number; j: number; dx: number; dy: number; d: number }[] = [];
      for (let i = 0; i < NODE_COUNT - 1; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const id = key(i, j);
          if (nextEdges.has(id)) continue;
          const b = nodes[j];
          const dx = torusDiff(a.x - b.x, width);
          const dy = torusDiff(a.y - b.y, height);
          const d2 = dx*dx + dy*dy;
          if (d2 <= linkDistSq) cand.push({ i, j, dx, dy, d: Math.sqrt(d2) });
        }
      }
      cand.sort((p, q) => p.d - q.d);
      for (const { i, j, dx, dy, d } of cand) {
        if (degree[i] < DEGREE_CAP && degree[j] < DEGREE_CAP) {
          degree[i]++; degree[j]++;
          edges.push({ i, dx, dy, d });
          nextEdges.add(key(i, j));
        }
      }

      prevEdges = nextEdges;

      /* 3. draw */
      ctx.lineWidth = 1;
      for (const { i, dx, dy, d } of edges) {
        const a = nodes[i];
        ctx.strokeStyle = `rgba(139,69,19,${1 - d / LINK_DIST})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x - dx, a.y - dy);
        ctx.stroke();
      }

      /* 4. draw nodes */
      ctx.fillStyle = '#8B4513';
      for (const n of nodes) ctx.fillRect(n.x - 1, n.y - 1, 2, 2);

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    /* ────────── RESIZE ────────── */
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}
