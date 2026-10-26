import { useEffect, useRef } from "react";

/**
 * AsciiBackground
 *
 * Interactive full-screen ASCII character matrix:
 * - Ambient resting state: delicate, ultra-dim terminal dot field
 * - Cursor movement triggers dynamic fluid ripples of glowing ASCII glyphs
 * - Energy decays organically with kinetic ghosting
 * - Fully responsive with DPR support and zero overhead when idle
 */

const CHARS = " ·•:+*~=/#%@01NIKITHA";

export default function AsciiBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL_SIZE = 16;
    let cols = 0;
    let rows = 0;
    let totalCells = 0;

    let energy = new Float32Array(0);
    let charIndices = new Uint8Array(0);

    let lastMouseX = -9999;
    let lastMouseY = -9999;
    let hasMouseMoved = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      cols = Math.ceil(w / CELL_SIZE);
      rows = Math.ceil(h / CELL_SIZE);
      totalCells = cols * rows;

      const newEnergy = new Float32Array(totalCells);
      const newChars = new Uint8Array(totalCells);

      // Initialize with resting dots
      for (let i = 0; i < totalCells; i++) {
        newChars[i] = 1; // '·'
      }

      energy = newEnergy;
      charIndices = newChars;
    };

    resize();
    window.addEventListener("resize", resize);

    // Pointer move handler to inject energy into nearby cells
    const onPointerMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const dx = mouseX - (lastMouseX === -9999 ? mouseX : lastMouseX);
      const dy = mouseY - (lastMouseY === -9999 ? mouseY : lastMouseY);
      const speed = Math.hypot(dx, dy);

      lastMouseX = mouseX;
      lastMouseY = mouseY;
      hasMouseMoved = true;

      const centerCol = Math.floor(mouseX / CELL_SIZE);
      const centerRow = Math.floor(mouseY / CELL_SIZE);

      // Radius of influence (cells)
      const radius = Math.min(9, Math.max(4, Math.floor(speed * 0.12) + 4));

      for (let r = Math.max(0, centerRow - radius); r <= Math.min(rows - 1, centerRow + radius); r++) {
        for (let c = Math.max(0, centerCol - radius); c <= Math.min(cols - 1, centerCol + radius); c++) {
          const cellX = (c + 0.5) * CELL_SIZE;
          const cellY = (r + 0.5) * CELL_SIZE;
          const dist = Math.hypot(cellX - mouseX, cellY - mouseY);
          const maxDist = radius * CELL_SIZE;

          if (dist < maxDist) {
            const idx = r * cols + c;
            const factor = 1.0 - dist / maxDist;
            const intensity = Math.pow(factor, 1.6) * Math.min(1.0, 0.4 + speed * 0.025);

            energy[idx] = Math.min(1.0, energy[idx] + intensity * 0.85);

            // Scramble character on disturbance
            if (Math.random() < 0.6) {
              charIndices[idx] = Math.floor(Math.random() * CHARS.length);
            }
          }
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let animId;

    const render = () => {
      animId = requestAnimationFrame(render);

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Dark obsidian background
      ctx.fillStyle = "#07080b";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          let val = energy[idx];

          const posX = c * CELL_SIZE + CELL_SIZE / 2;
          const posY = r * CELL_SIZE + CELL_SIZE / 2;

          if (val > 0.015) {
            // Decay energy smoothly
            energy[idx] = val * 0.935;

            // Occasionally mutate character while active
            if (val > 0.3 && Math.random() < 0.08) {
              charIndices[idx] = Math.floor(Math.random() * CHARS.length);
            }

            const char = CHARS[charIndices[idx]];

            // Multi-tiered chromatic intensity
            if (val > 0.65) {
              // High energy: bright white-cyan glow
              ctx.fillStyle = `rgba(235, 245, 255, ${Math.min(1.0, val)})`;
            } else if (val > 0.3) {
              // Medium energy: electric cyan
              ctx.fillStyle = `rgba(56, 189, 248, ${val * 0.9})`;
            } else {
              // Low energy: muted slate
              ctx.fillStyle = `rgba(148, 163, 184, ${val * 0.75})`;
            }

            ctx.fillText(char, posX, posY);
          } else {
            // Ambient resting dot
            ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
            ctx.fillText("·", posX, posY);
          }
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="play-ascii-canvas" aria-hidden="true" />;
}
