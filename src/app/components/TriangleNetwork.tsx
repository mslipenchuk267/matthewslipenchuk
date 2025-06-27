'use client';
import { useRef, useEffect } from 'react';

export default function TriangleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /* ─────────────────────────────  BASICS  ─────────────────────────────── */
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    /* ─────────────────────────────  CONFIG  ─────────────────────────────── */
    const NODE_COUNT = 75;

    // line behaviour
    const LINK_DIST   = 140;   // connect when closer than this
    const BREAK_DIST  = 180;   // drop the line only after exceeding this
    const DEGREE_CAP  = 3;     // max edges per node

    // motion (Brownian-ish)
    const ACCEL     = 190;      // px/s² random kick
    const FRICTION  = 1;   // 1 = no drag, lower = slows faster
    const SPEED_CAP = 480;     // px/s max

    /* ─────────────────────────────  NODES  ──────────────────────────────── */
    interface Node { x: number; y: number; vx: number; vy: number }
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    }));

    /* ─────────────────────────────  EDGE STATE  ─────────────────────────── */
    // We remember edges from the previous frame so we can keep them
    // as long as they stay within BREAK_DIST.
    let prevEdges = new Set<string>();      // keys: "i-j" with i<j

    const linkDistSq  = LINK_DIST  * LINK_DIST;
    const breakDistSq = BREAK_DIST * BREAK_DIST;

    /* ─────────────────────────────  LOOP  ───────────────────────────────── */
    let last = performance.now();

    function key(i: number, j: number) { return i < j ? `${i}-${j}` : `${j}-${i}`; }

    function animate(now: number) {
      const dt = (now - last) / 1000;
      last = now;

      ctx.clearRect(0, 0, width, height);

      /* -------- 1. move nodes -------- */
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

        n.x += n.vx * dt;
        n.y += n.vy * dt;

        if (n.x < 0) n.x += width;  if (n.x > width)  n.x -= width;
        if (n.y < 0) n.y += height; if (n.y > height) n.y -= height;
      }

      /* -------- 2. compute edges with “stickiness” -------- */
      const degree = new Array(NODE_COUNT).fill(0);
      const edges: { a: Node; b: Node; d: number }[] = [];
      const nextEdges = new Set<string>();

      // Pass A – keep previous edges if still within BREAK_DIST
      for (const id of prevEdges) {
        const [iStr, jStr] = id.split('-');
        const i = +iStr, j = +jStr;
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy;
        if (d2 <= breakDistSq && degree[i] < DEGREE_CAP && degree[j] < DEGREE_CAP) {
          const d = Math.sqrt(d2);
          degree[i]++; degree[j]++;
          edges.push({ a, b, d });
          nextEdges.add(id);
        }
      }

      // Pass B – add new edges (shortest first) until degree cap reached
      const candidates: { i: number; j: number; d: number }[] = [];
      for (let i = 0; i < NODE_COUNT - 1; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const b = nodes[j];
          const id = key(i, j);
          if (nextEdges.has(id)) continue;               // already kept
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 <= linkDistSq) candidates.push({ i, j, d: Math.sqrt(d2) });
        }
      }
      candidates.sort((p, q) => p.d - q.d);             // shortest first
      for (const { i, j, d } of candidates) {
        if (degree[i] < DEGREE_CAP && degree[j] < DEGREE_CAP) {
          degree[i]++; degree[j]++;
          edges.push({ a: nodes[i], b: nodes[j], d });
          nextEdges.add(key(i, j));
        }
      }

      prevEdges = nextEdges;   // remember for next frame

      /* -------- 3. draw -------- */
      ctx.lineWidth = 1;
      for (const { a, b, d } of edges) {
        ctx.strokeStyle = `rgba(139,69,19,${1 - d / LINK_DIST})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // optional: tiny dots so you can see the nodes
      ctx.fillStyle = '#8B4513';
      for (const n of nodes) ctx.fillRect(n.x - 1, n.y - 1, 2, 2);

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    /* -------- resize -------- */
    const onResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}
