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
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

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

    const ACCEL     = 150;
    const FRICTION  = 0.98;
    const SPEED_CAP = 220;

    // Transition settings
    const FADE_IN_SPEED = 3.0;
    const FADE_OUT_SPEED = 2.0;

    /* ────────── NODES ────────── */
    interface Node { x: number; y: number; vx: number; vy: number }
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    }));

    /* ────────── PERSISTENT EDGE STATE ────────── */
    interface PersistentEdge {
      i: number;
      j: number;
      opacity: number;
      targetOpacity: number;
      color: string;
      lastActiveTime: number;
      isActive: boolean;
    }
    
    const persistentEdges = new Map<string, PersistentEdge>();
    const linkDistSq  = LINK_DIST  * LINK_DIST;
    const breakDistSq = BREAK_DIST * BREAK_DIST;
    const key = (i: number, j: number) => (i < j ? `${i}-${j}` : `${j}-${i}`);

    // Generate a consistent color for each edge based on node indices
    const getEdgeColor = (i: number, j: number): string => {
      // Use a simple hash to get consistent colors
      const hash = (i * 73 + j * 37) % 360;
      const hue = hash;
      const saturation = 30 + (hash % 40); // 30-70%
      const lightness = 40 + (hash % 20);  // 40-60%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // Torus distance and position calculation
    const torusDiff = (d: number, size: number) => {
      if (Math.abs(d) > size / 2) {
        return d > 0 ? d - size : d + size;
      }
      return d;
    };

    // Draw a line that wraps around screen edges
    const drawWrappedLine = (x1: number, y1: number, x2: number, y2: number, strokeStyle: string) => {
      ctx.strokeStyle = strokeStyle;
      
      // Check if line needs to wrap horizontally
      const needsHorizontalWrap = Math.abs(x2 - x1) > width / 2;
      // Check if line needs to wrap vertically  
      const needsVerticalWrap = Math.abs(y2 - y1) > height / 2;
      
      if (!needsHorizontalWrap && !needsVerticalWrap) {
        // No wrapping needed - draw normal line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return;
      }
      
      // Calculate actual wrapped positions
      let actualX2 = x2;
      let actualY2 = y2;
      
      if (needsHorizontalWrap) {
        if (x2 > x1) {
          actualX2 = x2 - width;
        } else {
          actualX2 = x2 + width;
        }
      }
      
      if (needsVerticalWrap) {
        if (y2 > y1) {
          actualY2 = y2 - height;
        } else {
          actualY2 = y2 + height;
        }
      }
      
      // Draw the wrapped line segments
      if (needsHorizontalWrap && !needsVerticalWrap) {
        // Horizontal wrap only
        if (actualX2 < x1) {
          // Line goes from right to left across left edge
          const t = x1 / (x1 - actualX2); // intersection parameter
          const intersectY = y1 + t * (actualY2 - y1);
          
          // Draw from start to left edge
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(0, intersectY);
          ctx.stroke();
          
          // Draw from right edge to end
          ctx.beginPath();
          ctx.moveTo(width, intersectY);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        } else {
          // Line goes from left to right across right edge
          const t = (width - x1) / (actualX2 - x1);
          const intersectY = y1 + t * (actualY2 - y1);
          
          // Draw from start to right edge
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(width, intersectY);
          ctx.stroke();
          
          // Draw from left edge to end
          ctx.beginPath();
          ctx.moveTo(0, intersectY);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      } else if (needsVerticalWrap && !needsHorizontalWrap) {
        // Vertical wrap only
        if (actualY2 < y1) {
          // Line goes from bottom to top across top edge
          const t = y1 / (y1 - actualY2);
          const intersectX = x1 + t * (actualX2 - x1);
          
          // Draw from start to top edge
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(intersectX, 0);
          ctx.stroke();
          
          // Draw from bottom edge to end
          ctx.beginPath();
          ctx.moveTo(intersectX, height);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        } else {
          // Line goes from top to bottom across bottom edge
          const t = (height - y1) / (actualY2 - y1);
          const intersectX = x1 + t * (actualX2 - x1);
          
          // Draw from start to bottom edge
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(intersectX, height);
          ctx.stroke();
          
          // Draw from top edge to end
          ctx.beginPath();
          ctx.moveTo(intersectX, 0);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      } else {
        // Both horizontal and vertical wrap - draw corner-to-corner
        // This is complex, so for now just draw the direct wrapped line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(actualX2, actualY2);
        ctx.stroke();
      }
    };

    /* ────────── MAIN LOOP ────────── */
    let last = performance.now();

    function ensureContextState() {
        const ratio = window.devicePixelRatio || 1;
        const currentTransform = ctx.getTransform();
        
        if (Math.abs(currentTransform.a - ratio) > 0.01 || Math.abs(currentTransform.d - ratio) > 0.01) {
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        }
        
        ctx.imageSmoothingEnabled = false;
    }

    function animate(now: number) {
      const dt = (now - last) / 1000;
      last = now;

      ensureContextState();
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

        n.x += n.vx * dt;
        n.y += n.vy * dt;
        
        n.x = ((n.x % width) + width) % width;
        n.y = ((n.y % height) + height) % height;
      }

      /* 2. Update persistent edge states */
      const currentActiveEdges = new Set<string>();
      const degree = new Array(NODE_COUNT).fill(0);

      // First pass: check existing edges and mark active ones
      for (const [edgeId, edge] of persistentEdges) {
        const a = nodes[edge.i], b = nodes[edge.j];
        const dx = torusDiff(a.x - b.x, width);
        const dy = torusDiff(a.y - b.y, height);
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance * distance <= breakDistSq && degree[edge.i] < DEGREE_CAP && degree[edge.j] < DEGREE_CAP) {
          degree[edge.i]++;
          degree[edge.j]++;
          currentActiveEdges.add(edgeId);
          edge.isActive = true;
          edge.targetOpacity = 1;
          edge.lastActiveTime = now;
        } else {
          edge.isActive = false;
          edge.targetOpacity = 0;
        }
      }

      // Second pass: find new potential edges
      const candidates: { id: string; i: number; j: number; d: number }[] = [];
      for (let i = 0; i < NODE_COUNT - 1; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const edgeId = key(i, j);
          if (currentActiveEdges.has(edgeId)) continue;
          
          const b = nodes[j];
          const dx = torusDiff(a.x - b.x, width);
          const dy = torusDiff(a.y - b.y, height);
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          if (distance * distance <= linkDistSq) {
            candidates.push({ id: edgeId, i, j, d: distance });
          }
        }
      }

      // Sort by distance and create new persistent edges
      candidates.sort((p, q) => p.d - q.d);
      for (const { id, i, j } of candidates) {
        if (degree[i] < DEGREE_CAP && degree[j] < DEGREE_CAP) {
          degree[i]++;
          degree[j]++;
          
          // Create new persistent edge if it doesn't exist
          if (!persistentEdges.has(id)) {
            persistentEdges.set(id, {
              i,
              j,
              opacity: 0,
              targetOpacity: 1,
              color: getEdgeColor(i, j),
              lastActiveTime: now,
              isActive: true
            });
          } else {
            // Reactivate existing edge
            const edge = persistentEdges.get(id)!;
            edge.isActive = true;
            edge.targetOpacity = 1;
            edge.lastActiveTime = now;
          }
        }
      }

      /* 3. Update edge opacities smoothly */
      const edgesToRemove: string[] = [];
      for (const [edgeId, edge] of persistentEdges) {
        // Smooth opacity transition
        if (edge.opacity < edge.targetOpacity) {
          edge.opacity = Math.min(edge.targetOpacity, edge.opacity + FADE_IN_SPEED * dt);
        } else if (edge.opacity > edge.targetOpacity) {
          edge.opacity = Math.max(edge.targetOpacity, edge.opacity - FADE_OUT_SPEED * dt);
        }

        // Remove edges that have been inactive and fully faded
        if (!edge.isActive && edge.opacity <= 0 && (now - edge.lastActiveTime) > 1000) {
          edgesToRemove.push(edgeId);
        }
      }

      // Clean up old edges
      for (const edgeId of edgesToRemove) {
        persistentEdges.delete(edgeId);
      }

      /* 4. Draw persistent edges */
      ctx.lineWidth = 1;
      for (const [, edge] of persistentEdges) {
        if (edge.opacity <= 0.01) continue;

        const a = nodes[edge.i], b = nodes[edge.j];
        const dx = torusDiff(a.x - b.x, width);
        const dy = torusDiff(a.y - b.y, height);
        const distance = Math.sqrt(dx*dx + dy*dy);

        // Combine distance-based alpha with persistent opacity
        const distanceAlpha = Math.max(0, 1 - distance / LINK_DIST);
        const finalAlpha = distanceAlpha * edge.opacity;

        if (finalAlpha > 0.01) {
          // Parse the HSL color and add alpha
          const hslMatch = edge.color.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
          let strokeStyle;
          if (hslMatch) {
            const [, h, s, l] = hslMatch;
            strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${finalAlpha})`;
          } else {
            strokeStyle = `rgba(139,69,19,${finalAlpha})`;
          }
          
          // Use the wrapped line drawing function
          drawWrappedLine(a.x, a.y, b.x, b.y, strokeStyle);
        }
      }

      /* 5. draw nodes */
      ctx.fillStyle = isDark ? '#d4a574' : '#8B4513';
      for (const n of nodes) ctx.fillRect(n.x - 1, n.y - 1, 2, 2);

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    /* ────────── RESIZE ────────── */
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      const widthChange = Math.abs(newWidth - width) / width;
      const heightChange = Math.abs(newHeight - height) / height;
      
      if (widthChange > 0.05 || heightChange > 0.05) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          resizeCanvas();
          // Redistribute nodes for new dimensions
          for (const n of nodes) {
            if (n.x > width) n.x = Math.random() * width;
            if (n.y > height) n.y = Math.random() * height;
          }
          // Don't clear persistent edges - they'll fade out naturally if invalid
        }, 100);
      }
    };
    
    /* ────────── MOBILE SCROLL PREVENTION ────────── */
    const preventCanvasInterference = (e: TouchEvent) => {
        if (e.target === canvas) {
        e.preventDefault();
        e.stopPropagation();
        }
    };
    
    const preventWheelOnCanvas = (e: WheelEvent) => {
        e.preventDefault();
    };
    
    canvas.addEventListener('touchstart', preventCanvasInterference, { passive: false });
    canvas.addEventListener('touchmove', preventCanvasInterference, { passive: false });
    canvas.addEventListener('touchend', preventCanvasInterference, { passive: false });
    canvas.addEventListener('wheel', preventWheelOnCanvas, { passive: false });
    
    const handleVisualViewportResize = () => {
        handleResize();
    };
    
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }
    
    return () => {
        window.removeEventListener('resize', handleResize);
        if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
        }
        canvas.removeEventListener('touchstart', preventCanvasInterference);
        canvas.removeEventListener('touchmove', preventCanvasInterference);
        canvas.removeEventListener('touchend', preventCanvasInterference);
        canvas.removeEventListener('wheel', preventWheelOnCanvas);
        clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10"
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    />
  );
}