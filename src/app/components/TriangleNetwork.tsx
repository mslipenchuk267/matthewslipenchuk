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

    /* retina-proof sizing - MOBILE-FOCUSED METHOD */
    let width = 0, height = 0;
    
    // Use visual viewport if available (prevents URL bar issues)
    const getViewportDimensions = () => {
      if (window.visualViewport) {
        return {
          width: window.visualViewport.width,
          height: window.visualViewport.height
        };
      }
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };
    
    function resizeCanvas() {
      const { width: cssW, height: cssH } = getViewportDimensions();
      const ratio = window.devicePixelRatio || 1;

      // Store logical dimensions first
      width = cssW;
      height = cssH;

      // Setting canvas.width/height automatically clears the canvas and resets context
      canvas.width = cssW * ratio;
      canvas.height = cssH * ratio;
      
      // Set CSS display size
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      
      // Scale context for high-DPI rendering
      // This must be done after setting canvas.width/height since that resets the context
      ctx.scale(ratio, ratio);
      
      // Ensure crisp lines
      ctx.imageSmoothingEnabled = false;
    }

    resizeCanvas();

    /* ────────── CONFIG ────────── */
    const NODE_COUNT = isMobile ? 30 : 80;   // half as many on mobile
    const LINK_DIST  = 140;
    const BREAK_DIST = 180;
    const DEGREE_CAP = 3;

    const ACCEL     = 150;                    // lower kick feels smoother ★ changed
    const FRICTION  = 0.98;                   // < 1 = gradual slowing   ★ changed
    const SPEED_CAP = 220;                    // less frantic top speed  ★ changed

    // Transition settings
    const FADE_IN_SPEED = 3.0;   // How fast lines fade in
    const FADE_OUT_SPEED = 2.0;  // How fast lines fade out

    /* ────────── NODES ────────── */
    interface Node { x: number; y: number; vx: number; vy: number }
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    }));

    /* ────────── EDGE STATE WITH OPACITY ────────── */
    interface EdgeState {
      opacity: number;
      active: boolean;
    }
    
    const edgeStates = new Map<string, EdgeState>();
    const linkDistSq  = LINK_DIST  * LINK_DIST;
    const breakDistSq = BREAK_DIST * BREAK_DIST;
    const key = (i: number, j: number) => (i < j ? `${i}-${j}` : `${j}-${i}`);

    // FIXED torus distance calculation
    const torusDiff = (d: number, size: number) => {
      if (Math.abs(d) > size / 2) {
        return d > 0 ? d - size : d + size;
      }
      return d;
    };

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

        // FIXED torus wrapping
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        
        // Proper modulo that handles negatives
        n.x = ((n.x % width) + width) % width;
        n.y = ((n.y % height) + height) % height;
      }

      /* 2. compute current valid edges */
      const degree = new Array(NODE_COUNT).fill(0);
      const validEdges = new Set<string>();

      // Check existing edges first (for degree calculation)
      for (const [edgeId, state] of edgeStates) {
        if (state.opacity <= 0) continue;
        
        const [iStr, jStr] = edgeId.split('-');
        const i = +iStr, j = +jStr;
        const a = nodes[i], b = nodes[j];
        const dx = torusDiff(a.x - b.x, width);
        const dy = torusDiff(a.y - b.y, height);
        const d2 = dx*dx + dy*dy;

        if (d2 <= breakDistSq && degree[i] < DEGREE_CAP && degree[j] < DEGREE_CAP) {
          degree[i]++; 
          degree[j]++;
          validEdges.add(edgeId);
        }
      }

      // Find new potential edges
      const candidates: { id: string; i: number; j: number; d: number }[] = [];
      for (let i = 0; i < NODE_COUNT - 1; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const edgeId = key(i, j);
          if (validEdges.has(edgeId)) continue;
          
          const b = nodes[j];
          const dx = torusDiff(a.x - b.x, width);
          const dy = torusDiff(a.y - b.y, height);
          const d2 = dx*dx + dy*dy;
          
          if (d2 <= linkDistSq) {
            candidates.push({ id: edgeId, i, j, d: Math.sqrt(d2) });
          }
        }
      }

      // Sort by distance and add valid new edges
      candidates.sort((p, q) => p.d - q.d);
      for (const { id, i, j } of candidates) {
        if (degree[i] < DEGREE_CAP && degree[j] < DEGREE_CAP) {
          degree[i]++; 
          degree[j]++;
          validEdges.add(id);
        }
      }

      /* 3. update edge states */
      // Mark current valid edges as active
      for (const [edgeId, state] of edgeStates) {
        state.active = validEdges.has(edgeId);
      }

      // Create new edge states for new edges
      for (const edgeId of validEdges) {
        if (!edgeStates.has(edgeId)) {
          edgeStates.set(edgeId, { opacity: 0, active: true });
        }
      }

      // Update opacities
      const edgesToRemove: string[] = [];
      for (const [edgeId, state] of edgeStates) {
        if (state.active) {
          // Fade in
          state.opacity = Math.min(1, state.opacity + FADE_IN_SPEED * dt);
        } else {
          // Fade out
          state.opacity = Math.max(0, state.opacity - FADE_OUT_SPEED * dt);
          if (state.opacity <= 0) {
            edgesToRemove.push(edgeId);
          }
        }
      }

      // Clean up fully faded edges
      for (const edgeId of edgesToRemove) {
        edgeStates.delete(edgeId);
      }

      /* 4. draw edges with smooth opacity */
      ctx.lineWidth = 1;
      for (const [edgeId, state] of edgeStates) {
        if (state.opacity <= 0) continue;

        const [iStr, jStr] = edgeId.split('-');
        const i = +iStr, j = +jStr;
        const a = nodes[i], b = nodes[j];
        const dx = torusDiff(a.x - b.x, width);
        const dy = torusDiff(a.y - b.y, height);
        const d = Math.sqrt(dx*dx + dy*dy);

        // Combine distance-based alpha with fade opacity
        const distanceAlpha = 1 - d / LINK_DIST;
        const finalAlpha = distanceAlpha * state.opacity;

        ctx.strokeStyle = `rgba(139,69,19,${finalAlpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x - dx, a.y - dy);
        ctx.stroke();
      }

      /* 5. draw nodes */
      ctx.fillStyle = '#8B4513';
      for (const n of nodes) ctx.fillRect(n.x - 1, n.y - 1, 2, 2);

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    /* ────────── RESIZE ────────── */
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Only resize if dimensions actually changed significantly
      // This prevents mobile browser UI changes from triggering resize
      const widthChange = Math.abs(newWidth - width) / width;
      const heightChange = Math.abs(newHeight - height) / height;
      
      // Only resize if change is more than 5% or if it's a significant size change
      if (widthChange > 0.05 || heightChange > 0.05) {
        // Debounce resize to prevent multiple rapid calls
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          resizeCanvas();
          // Redistribute nodes for new dimensions
          for (const n of nodes) {
            if (n.x > width) n.x = Math.random() * width;
            if (n.y > height) n.y = Math.random() * height;
          }
          // Clear edge states to avoid weird connections during resize
          edgeStates.clear();
        }, 100);
      }
    };
    
    /* ────────── MOBILE SCROLL PREVENTION ────────── */
    const preventScroll = (e: TouchEvent | WheelEvent) => {
      // Don't prevent pull-to-refresh at the top of the page
      if (e.type === 'touchstart' || e.type === 'touchmove') {
        const touch = (e as TouchEvent).touches[0];
        if (touch && window.scrollY === 0 && e.type === 'touchstart') {
          // Allow pull-to-refresh gesture at top of page
          return;
        }
      }
      e.preventDefault();
    };

    // Prevent scrolling but allow pull-to-refresh
    canvas.addEventListener('touchmove', preventScroll, { passive: false });
    canvas.addEventListener('wheel', preventScroll, { passive: false });

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      canvas.removeEventListener('touchmove', preventScroll);
      canvas.removeEventListener('wheel', preventScroll);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10"
      style={{
        touchAction: 'none', // Prevents scrolling/zooming on mobile
        userSelect: 'none',  // Prevents text selection
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    />
  );
}