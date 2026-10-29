import { useEffect, useRef, useState, useCallback } from "react";
import { PLAY_ITEMS } from "../data/playItems.js";
import AsciiBackground from "../components/AsciiBackground.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { getWorkUrl } from "../utils/domain.js";
import { Home01Icon } from "@hugeicons/core-free-icons";
import "./PlayWarp.css";

// 4-Sided Spherical Fold Vertex Shader
const VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 aUV;

uniform vec2  uRes;          // Canvas resolution in DPR pixels (width, height)
uniform vec4  uRect;         // Card rect in DPR pixels (left, top, width, height)
uniform float uRot;          // Card rotation in radians
uniform vec2  uCover;        // Texture aspect ratio cover scale
uniform vec2  uFlat;         // Half-dimensions of flat center zone (flatX, flatY)
uniform vec2  uAngle;        // Fold angles (angleX, angleY) in radians
uniform vec2  uRound;        // Cylinder fold radii (roundX, roundY) in DPR pixels
uniform float uPersp;        // Perspective depth divisor

out vec2 vUV;
out vec2 vQuad;
out float vDepth;

vec2 foldAt(float s, float a, float r) {
  if (s <= 0.0 || a <= 0.0) return vec2(s, 0.0);
  r = max(r, 0.001);
  float arc = r * a;
  if (s < arc) {
    float th = s / r;
    return vec2(r * sin(th), -r * (1.0 - cos(th)));
  }
  float d = s - arc;
  return vec2(r * sin(a) + d * cos(a), -r * (1.0 - cos(a)) - d * sin(a));
}

void main() {
  vUV = vec2((aUV.x - 0.5) * uCover.x + 0.5, (aUV.y - 0.5) * uCover.y + 0.5);
  vQuad = aUV;

  // Exact screen coordinate in DPR pixels with card rotation around center
  vec2 cardCenter = uRect.xy + uRect.zw * 0.5;
  vec2 localP = (aUV - 0.5) * uRect.zw;
  float cRot = cos(uRot);
  float sRot = sin(uRot);
  vec2 rotP = vec2(localP.x * cRot - localP.y * sRot, localP.x * sRot + localP.y * cRot);
  vec2 p = cardCenter + rotP;
  vec2 center = uRes * 0.5;

  // 1. Horizontal fold along left & right edges (Concave: curves forward towards viewer)
  float dx = p.x - center.x;
  float absDx = abs(dx);
  float sX = max(0.0, absDx - uFlat.x);
  vec2 fX = foldAt(sX, uAngle.x, uRound.x);
  float foldedX = absDx > uFlat.x ? center.x + sign(dx) * (uFlat.x + fX.x) : p.x;
  float zX = absDx > uFlat.x ? -fX.y : 0.0; // Positive Z = curves forward (concave)

  // 2. Vertical fold along top & bottom edges (Concave: curves forward towards viewer)
  float dy = p.y - center.y;
  float absDy = abs(dy);
  float sY = max(0.0, absDy - uFlat.y);
  vec2 fY = foldAt(sY, uAngle.y, uRound.y);
  float foldedY = absDy > uFlat.y ? center.y + sign(dy) * (uFlat.y + fY.x) : p.y;
  float zY = absDy > uFlat.y ? -fY.y : 0.0; // Positive Z = curves forward (concave)

  // Total compounded concave depth
  float z = zX + zY;

  // 3. Perspective projection: edges curve forward towards camera
  float k = uPersp / max(uPersp - z, uPersp * 0.25);
  float sx = center.x + (foldedX - center.x) * k;
  float sy = center.y + (foldedY - center.y) * k;

  vDepth = z;

  float depth = clamp(0.5 - z / 12000.0, 0.0, 0.999);
  gl_Position = vec4(
    (sx / uRes.x) * 2.0 - 1.0,
    1.0 - (sy / uRes.y) * 2.0,
    depth,
    1.0
  );
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUV;
in vec2 vQuad;
in float vDepth;

uniform sampler2D uTex;
uniform vec2  uSize;         // Card size in DPR pixels
uniform float uRadius;       // Corner radius in DPR pixels

out vec4 frag;

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 p = (vQuad - 0.5) * uSize;
  vec2 halfSize = uSize * 0.5;
  float dpr = max(1.0, uRadius / 16.0);

  // Classic Postage Stamp Perforations (8:10 portrait aspect ratio)
  float pitch = 14.0 * dpr;
  float numHolesX = max(4.0, floor(uSize.x / pitch));
  float pitchX = uSize.x / numHolesX;
  float numHolesY = max(4.0, floor(uSize.y / pitch));
  float pitchY = uSize.y / numHolesY;

  // Scalloped cut hole radius (~22% of pitch)
  float rHole = min(pitchX, pitchY) * 0.22;

  // Nearest hole on horizontal edges (top/bottom)
  float uX = (p.x + halfSize.x) / pitchX;
  float kX = clamp(floor(uX), 0.0, numHolesX - 1.0);
  float holeCenterX = (kX + 0.5) * pitchX - halfSize.x;
  float dHoleH = length(vec2(p.x - holeCenterX, abs(p.y) - halfSize.y)) - rHole;

  // Nearest hole on vertical edges (left/right)
  float uY = (p.y + halfSize.y) / pitchY;
  float kY = clamp(floor(uY), 0.0, numHolesY - 1.0);
  float holeCenterY = (kY + 0.5) * pitchY - halfSize.y;
  float dHoleV = length(vec2(abs(p.x) - halfSize.x, p.y - holeCenterY)) - rHole;

  float dHole = min(dHoleH, dHoleV);

  // Outer base card box with stamp corner radius
  float cornerRadius = 4.0 * dpr;
  float dBox = sdRoundedBox(p, halfSize - 1.0, cornerRadius);

  // CSG Subtraction: Stamp box minus circular edge perforation cuts
  float d = dBox;
  if (dHole < 16.0 * dpr) {
    d = max(dBox, -dHole);
  }

  float aa = max(fwidth(d), 0.001);
  float mask = 1.0 - smoothstep(-aa, aa, d);

  if (mask <= 0.001) discard;

  vec3 col = texture(uTex, vUV).rgb;

  // Crisp static border matching site style along the stamp scallops
  float border = 1.0 - smoothstep(0.0, aa * 1.5, abs(d + 1.2));
  vec3 borderColor = vec3(0.24, 0.26, 0.30);
  col = mix(col, borderColor, border * 0.45);

  // Delicate vintage stamp hairline frame
  vec2 innerMargin = vec2(7.0 * dpr);
  if (halfSize.x > innerMargin.x * 2.5 && halfSize.y > innerMargin.y * 2.5) {
    float dInner = sdRoundedBox(p, halfSize - innerMargin, 2.0 * dpr);
    float innerBorder = 1.0 - smoothstep(0.0, aa * 1.5, abs(dInner));
    col = mix(col, vec3(0.92, 0.94, 0.98), innerBorder * 0.16);
  }

  // Subtle concave lighting
  float depthLighting = clamp(0.9 + vDepth / 1800.0, 0.75, 1.08);
  col *= depthLighting;

  frag = vec4(col * mask, mask);
}
`;

const COLS = 16;
const ROWS = 48;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[PlayWarp] shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createMesh(gl) {
  const vertices = new Float32Array((COLS + 1) * (ROWS + 1) * 2);
  let vIdx = 0;
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      vertices[vIdx++] = c / COLS;
      vertices[vIdx++] = r / ROWS;
    }
  }

  const indices = new Uint16Array(COLS * ROWS * 6);
  let iIdx = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = r * (COLS + 1) + c;
      const right = p + 1;
      const down = p + COLS + 1;
      const downRight = down + 1;
      indices[iIdx++] = p;
      indices[iIdx++] = down;
      indices[iIdx++] = right;
      indices[iIdx++] = right;
      indices[iIdx++] = down;
      indices[iIdx++] = downRight;
    }
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const ebo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  return { vao, vbo, ebo, count: indices.length };
}

// Pure deterministic pseudo-random hash for infinite 2D coordinates (c, r)
function cellHash(c, r, seed = 0) {
  let h = (c * 374761393 + r * 668265263 + seed * 961748927) ^ 0x5bf03635;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Guaranteed zero-overlap organic layout transform
function getCardTransform(c, r, cellW, cellH, maxJitterX, maxJitterY) {
  // Alternating column vertical stagger (breaks horizontal grid lines without horizontal collision)
  const colStagger = (c % 2 !== 0 ? 0.35 : 0.0) * cellH;

  // Controlled, bounded jitter strictly within the safe cell margin (guaranteed positive gap)
  const jitterX = (cellHash(c, r, 1) - 0.5) * 2.0 * maxJitterX;
  const jitterY = (cellHash(c, r, 2) - 0.5) * 2.0 * maxJitterY;

  // Subtle organic stamp tilt (-1.8° to +1.8°)
  const rotDeg = (cellHash(c, r, 3) - 0.5) * 3.6;
  const rotRad = rotDeg * (Math.PI / 180);

  return {
    x: c * cellW + jitterX,
    y: r * cellH + colStagger + jitterY,
    rot: rotRad,
  };
}

export default function PlayWarp() {
  const canvasRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);

  // Physics & Full-bleed 2D Infinite Canvas State
  const scrollRef = useRef({
    x: 0,
    targetX: 0,
    y: 0,
    targetY: 0,
    velocity: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    lastTime: performance.now(),
  });

  const navigateLightbox = useCallback((direction) => {
    setActiveItem((curr) => {
      if (!curr) return null;
      const idx = PLAY_ITEMS.findIndex((i) => i.id === curr.id);
      if (idx === -1) return curr;
      const nextIdx = (idx + direction + PLAY_ITEMS.length) % PLAY_ITEMS.length;
      return PLAY_ITEMS[nextIdx];
    });
  }, []);

  // WebGL Render Loop & Full-Screen Infinite Grid Math
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      depth: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.warn("[PlayWarp] WebGL2 not supported.");
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "aUV");
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[PlayWarp] link error:", gl.getProgramInfoLog(program));
      return;
    }

    const uniforms = {
      uRes: gl.getUniformLocation(program, "uRes"),
      uRect: gl.getUniformLocation(program, "uRect"),
      uRot: gl.getUniformLocation(program, "uRot"),
      uCover: gl.getUniformLocation(program, "uCover"),
      uFlat: gl.getUniformLocation(program, "uFlat"),
      uAngle: gl.getUniformLocation(program, "uAngle"),
      uRound: gl.getUniformLocation(program, "uRound"),
      uPersp: gl.getUniformLocation(program, "uPersp"),
      uTex: gl.getUniformLocation(program, "uTex"),
      uSize: gl.getUniformLocation(program, "uSize"),
      uRadius: gl.getUniformLocation(program, "uRadius"),
    };

    const mesh = createMesh(gl);

    // Texture Cache
    const textureMap = new Map();

    const getTexture = (item) => {
      if (textureMap.has(item.src)) {
        return textureMap.get(item.src);
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = item.src;

      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([12, 14, 18, 255])
      );
      gl.bindTexture(gl.TEXTURE_2D, null);

      textureMap.set(item.src, tex);

      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          item.width = img.naturalWidth;
          item.height = img.naturalHeight;
          item.aspect = img.naturalWidth / img.naturalHeight;
        }
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
      };

      img.onerror = (e) => {
        console.error("[PlayWarp] Failed to load image texture:", item.src, e);
      };

      return tex;
    };

    PLAY_ITEMS.forEach(getTexture);

    let animId;

    const render = () => {
      animId = requestAnimationFrame(render);

      const now = performance.now();
      const dt = Math.min((now - scrollRef.current.lastTime) / 1000, 0.1);
      scrollRef.current.lastTime = now;

      const state = scrollRef.current;

      // Smooth scroll & pan lerp (with damping)
      state.x += (state.targetX - state.x) * (1 - Math.exp(-12 * dt));
      state.y += (state.targetY - state.y) * (1 - Math.exp(-12 * dt));

      const frameDeltaX = state.targetX - state.x;
      const frameDeltaY = state.targetY - state.y;
      const speed = Math.hypot(frameDeltaX, frameDeltaY);
      state.velocity += (speed - state.velocity) * (1 - Math.exp(-8 * dt));

      // Resize Canvas
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pixelW = Math.round(vw * dpr);
      const pixelH = Math.round(vh * dpr);

      if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);
      gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);

      // Card Dimensions & Guaranteed Collision-Free Organic Spacing
      const baseCols = vw > 1600 ? 10 : vw > 1100 ? 8 : vw > 600 ? 6 : 4;
      const minGapX = vw > 768 ? 16 : 10;
      const minGapY = vw > 768 ? 18 : 12;
      const maxJitterX = vw > 768 ? 10 : 6;
      const maxJitterY = vw > 768 ? 12 : 7;

      const cardW = Math.round((vw - (baseCols - 1) * (minGapX + 2 * maxJitterX)) / baseCols);
      const cardH = Math.round(cardW * 1.25); // 8:10 aspect ratio (4:5)

      const cellW = cardW + minGapX + 2 * maxJitterX;
      const cellH = cardH + minGapY + 2 * maxJitterY;

      // Dynamic Speed Distortion Factor (0.0 when static, 1.0 at nice scrolling speed)
      const t = Math.min(1.0, state.velocity / 160.0);
      const warpFactor = t * t * (3.0 - 2.0 * t); // smoothstep 0.0 -> 1.0

      // 4-Sided Fold Parameters:
      // When static (warpFactor = 0.0): fold angles are 0.0, grid is 100% flat.
      // When scrolling at a nice speed: smoothly curves into the full concave curvature.
      const baseFlatX = vw * 0.32 * dpr;
      const baseFlatY = vh * 0.26 * dpr;
      const flatX = baseFlatX * (1.0 - warpFactor * 0.4);
      const flatY = baseFlatY * (1.0 - warpFactor * 0.4);

      const maxAngleX = 28.0 * (Math.PI / 180);
      const maxAngleY = 32.0 * (Math.PI / 180);
      const angleX = warpFactor * maxAngleX;
      const angleY = warpFactor * maxAngleY;

      const roundX = 320.0 * dpr;
      const roundY = 280.0 * dpr;
      const persp = 1600.0 * dpr;

      gl.uniform2f(uniforms.uFlat, flatX, flatY);
      gl.uniform2f(uniforms.uAngle, angleX, angleY);
      gl.uniform2f(uniforms.uRound, roundX, roundY);
      gl.uniform1f(uniforms.uPersp, persp);

      gl.bindVertexArray(mesh.vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(uniforms.uTex, 0);

      // FULL BLEED 100% WIDTH & HEIGHT INFINITE MOSAIC:
      // Render columns starting BEFORE the left edge to AFTER the right edge,
      // expanded to account for organic offsets, stagger, and 3D perspective fold.
      const minCol = Math.floor((-state.x - cardW * 3) / cellW);
      const maxCol = Math.ceil((vw - state.x + cardW * 3) / cellW);

      const minRow = Math.floor((state.y - cardH * 3) / cellH);
      const maxRow = Math.ceil((state.y + vh + cardH * 3) / cellH);

      const totalItems = PLAY_ITEMS.length;

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const { x: stampX, y: stampY, rot: stampRot } = getCardTransform(c, r, cellW, cellH, maxJitterX, maxJitterY);
          const screenX = stampX + state.x;
          const screenY = stampY - state.y;

          // Continuous positive modulo 2D indexing
          const itemIndex = ((r * baseCols + c) % totalItems + totalItems) % totalItems;
          const item = PLAY_ITEMS[itemIndex];

          const tex = getTexture(item);
          gl.bindTexture(gl.TEXTURE_2D, tex);

          gl.uniform4f(
            uniforms.uRect,
            screenX * dpr,
            screenY * dpr,
            cardW * dpr,
            cardH * dpr
          );
          gl.uniform1f(uniforms.uRot, stampRot);

          // Aspect Ratio Cover
          const naturalW = item.width || 8;
          const naturalH = item.height || 10;
          const frameAspect = cardW / cardH;
          const imgAspect = naturalW / naturalH;
          let coverX = 1.0;
          let coverY = 1.0;
          if (frameAspect > imgAspect) {
            coverY = imgAspect / frameAspect;
          } else {
            coverX = frameAspect / imgAspect;
          }
          gl.uniform2f(uniforms.uCover, coverX, coverY);

          gl.uniform2f(uniforms.uSize, cardW * dpr, cardH * dpr);
          gl.uniform1f(uniforms.uRadius, 16.0 * dpr);

          gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
        }
      }

      gl.bindVertexArray(null);
    };

    animId = requestAnimationFrame(render);

    // Event Listeners: Wheel & Trackpad
    const onWheel = (e) => {
      e.preventDefault();
      const deltaFactor = e.deltaMode === 1 ? 30 : 1.15;
      scrollRef.current.targetY += e.deltaY * deltaFactor;
      if (Math.abs(e.deltaX) > 0.5) {
        scrollRef.current.targetX -= e.deltaX * deltaFactor;
      }
    };

    // Pointer / Drag Events
    const onPointerDown = (e) => {
      if (e.target.closest(".play-lightbox")) return;
      scrollRef.current.isDragging = true;
      scrollRef.current.dragStartX = e.clientX;
      scrollRef.current.dragStartY = e.clientY;
      scrollRef.current.lastPointerX = e.clientX;
      scrollRef.current.lastPointerY = e.clientY;
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (e) => {
      if (scrollRef.current.isDragging) {
        const dx = e.clientX - scrollRef.current.lastPointerX;
        const dy = e.clientY - scrollRef.current.lastPointerY;
        scrollRef.current.lastPointerX = e.clientX;
        scrollRef.current.lastPointerY = e.clientY;
        scrollRef.current.targetX += dx * 1.5;
        scrollRef.current.targetY -= dy * 1.5;
      }
    };

    const onPointerUp = (e) => {
      if (scrollRef.current.isDragging) {
        const dist = Math.hypot(
          e.clientX - scrollRef.current.dragStartX,
          e.clientY - scrollRef.current.dragStartY
        );
        if (dist < 6) {
          const rect = canvas.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          const vw = window.innerWidth;
          const baseCols = vw > 1600 ? 10 : vw > 1100 ? 8 : vw > 600 ? 6 : 4;
          const minGapX = vw > 768 ? 16 : 10;
          const minGapY = vw > 768 ? 18 : 12;
          const maxJitterX = vw > 768 ? 10 : 6;
          const maxJitterY = vw > 768 ? 12 : 7;

          const cardW = Math.round((vw - (baseCols - 1) * (minGapX + 2 * maxJitterX)) / baseCols);
          const cardH = Math.round(cardW * 1.25); // 8:10 aspect ratio (4:5)

          const cellW = cardW + minGapX + 2 * maxJitterX;
          const cellH = cardH + minGapY + 2 * maxJitterY;

          // Find candidate cells in 5x5 neighborhood around click point
          const approxC = Math.floor((clickX - scrollRef.current.x) / cellW);
          const approxR = Math.floor((clickY + scrollRef.current.y) / cellH);

          let bestDist = Infinity;
          let hitItem = null;

          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              const c = approxC + dc;
              const r = approxR + dr;
              const { x: stampX, y: stampY, rot: stampRot } = getCardTransform(c, r, cellW, cellH, maxJitterX, maxJitterY);
              const screenX = stampX + scrollRef.current.x;
              const screenY = stampY - scrollRef.current.y;
              const centerX = screenX + cardW * 0.5;
              const centerY = screenY + cardH * 0.5;

              const dx = clickX - centerX;
              const dy = clickY - centerY;
              const cosR = Math.cos(-stampRot);
              const sinR = Math.sin(-stampRot);
              const localX = dx * cosR - dy * sinR;
              const localY = dx * sinR + dy * cosR;

              if (Math.abs(localX) <= cardW * 0.5 + 4 && Math.abs(localY) <= cardH * 0.5 + 4) {
                const distSq = dx * dx + dy * dy;
                if (distSq < bestDist) {
                  bestDist = distSq;
                  const totalItems = PLAY_ITEMS.length;
                  const itemIndex = ((r * baseCols + c) % totalItems + totalItems) % totalItems;
                  hitItem = PLAY_ITEMS[itemIndex];
                }
              }
            }
          }

          if (hitItem) {
            setActiveItem(hitItem);
          }
        }
      }
      scrollRef.current.isDragging = false;
      canvas.style.cursor = "grab";
    };

    // Keyboard navigation
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveItem(null);
      } else if (activeItem) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          navigateLightbox(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          navigateLightbox(1);
        }
      } else {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          scrollRef.current.targetY += 300;
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          scrollRef.current.targetY -= 300;
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollRef.current.targetX += 300;
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollRef.current.targetX -= 300;
        } else if (e.code === "Space") {
          e.preventDefault();
          scrollRef.current.targetY += 600;
        }
      }
    };

    // Touch Support for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        scrollRef.current.isDragging = true;
        scrollRef.current.dragStartX = touch.clientX;
        scrollRef.current.dragStartY = touch.clientY;
        scrollRef.current.lastPointerX = touch.clientX;
        scrollRef.current.lastPointerY = touch.clientY;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && scrollRef.current.isDragging) {
        const touch = e.touches[0];
        const dx = touch.clientX - scrollRef.current.lastPointerX;
        const dy = touch.clientY - scrollRef.current.lastPointerY;
        scrollRef.current.lastPointerX = touch.clientX;
        scrollRef.current.lastPointerY = touch.clientY;
        scrollRef.current.targetX += dx * 1.8;
        scrollRef.current.targetY -= dy * 1.8;
      }
    };

    const onTouchEnd = () => {
      scrollRef.current.isDragging = false;
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);

      textureMap.forEach((tex) => gl.deleteTexture(tex));
      textureMap.clear();

      gl.deleteBuffer(mesh.vbo);
      gl.deleteBuffer(mesh.ebo);
      gl.deleteVertexArray(mesh.vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [activeItem, navigateLightbox]);

  return (
    <div className="play-root">
      {/* Interactive Cursor-Reactive ASCII Background */}
      <AsciiBackground />

      {/* Full-Bleed 4-Sided Spherical Fold Infinite Grid */}
      <canvas ref={canvasRef} className="play-canvas-wrap" />

      {/* Bottom Nav: Home button pill (left) leading to work.nikbobbary.com, Socials pill (right) */}
      <BottomNav
        visible={!activeItem}
        socialsOnly={true}
        showHome={true}
        homeHref={getWorkUrl()}
        homeIcon={Home01Icon}
        homeTooltip="work.nikbobbary.com"
        homeAriaLabel="Home — work.nikbobbary.com"
      />

      {/* Pure Media Modal (Click anywhere to close) */}
      {activeItem && (
        <div
          className="play-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveItem(null)}
        >
          <PureMedia item={activeItem} />
        </div>
      )}
    </div>
  );
}

function PureMedia({ item }) {
  const [jsonContent, setJsonContent] = useState(item?.json || null);
  const [jsonError, setJsonError] = useState(false);

  const src = item?.src || "";
  const isVideo =
    item?.type === "video" ||
    /\.(mp4|webm|mov|ogg)$/i.test(src);

  const isJson =
    item?.type === "json" ||
    /\.json$/i.test(src) ||
    Boolean(item?.json);

  useEffect(() => {
    if (isJson && !item?.json && src) {
      let active = true;
      fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load JSON");
          return res.json();
        })
        .then((data) => {
          if (active) setJsonContent(data);
        })
        .catch(() => {
          if (active) setJsonError(true);
        });
      return () => {
        active = false;
      };
    }
  }, [isJson, item?.json, src]);

  // 8:10 Postage Stamp Geometry for Lightbox (800 x 1000 coordinate space)
  const STAMP_WIDTH = 800;
  const STAMP_HEIGHT = 1000;
  const STAMP_PITCH = 40;
  const STAMP_HOLE_R = 8.8; // ~22% of pitch
  const STAMP_CORNER_R = 8;

  function buildStampPath(
    width = STAMP_WIDTH,
    height = STAMP_HEIGHT,
    pitch = STAMP_PITCH,
    rHole = STAMP_HOLE_R,
    cornerR = STAMP_CORNER_R
  ) {
    const numHolesX = width / pitch; // 20 holes
    const numHolesY = height / pitch; // 25 holes
    let d = `M ${cornerR} 0 `;

    // Top edge: left to right
    for (let i = 0; i < numHolesX; i++) {
      const cx = (i + 0.5) * pitch;
      d += `L ${cx - rHole} 0 A ${rHole} ${rHole} 0 0 0 ${cx + rHole} 0 `;
    }
    d += `L ${width - cornerR} 0 A ${cornerR} ${cornerR} 0 0 1 ${width} ${cornerR} `;

    // Right edge: top to bottom
    for (let i = 0; i < numHolesY; i++) {
      const cy = (i + 0.5) * pitch;
      d += `L ${width} ${cy - rHole} A ${rHole} ${rHole} 0 0 0 ${width} ${cy + rHole} `;
    }
    d += `L ${width} ${height - cornerR} A ${cornerR} ${cornerR} 0 0 1 ${width - cornerR} ${height} `;

    // Bottom edge: right to left
    for (let i = numHolesX - 1; i >= 0; i--) {
      const cx = (i + 0.5) * pitch;
      d += `L ${cx + rHole} ${height} A ${rHole} ${rHole} 0 0 0 ${cx - rHole} ${height} `;
    }
    d += `L ${cornerR} ${height} A ${cornerR} ${cornerR} 0 0 1 0 ${height - cornerR} `;

    // Left edge: bottom to top
    for (let i = numHolesY - 1; i >= 0; i--) {
      const cy = (i + 0.5) * pitch;
      d += `L 0 ${cy + rHole} A ${rHole} ${rHole} 0 0 0 0 ${cy - rHole} `;
    }
    d += `L 0 ${cornerR} A ${cornerR} ${cornerR} 0 0 1 ${cornerR} 0 Z`;

    return d;
  }

  const STAMP_PATH_D = buildStampPath();

  if (isVideo) {
    return (
      <div className="play-lightbox__stamp-wrapper">
        <svg
          viewBox={`0 0 ${STAMP_WIDTH} ${STAMP_HEIGHT}`}
          className="play-lightbox__stamp-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="lightbox-stamp-clip">
              <path d={STAMP_PATH_D} />
            </clipPath>
          </defs>
          <path d={STAMP_PATH_D} fill="#14171d" />
          <foreignObject
            x="0"
            y="0"
            width={STAMP_WIDTH}
            height={STAMP_HEIGHT}
            clipPath="url(#lightbox-stamp-clip)"
          >
            <video
              src={src}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              loop
              muted
              playsInline
            />
          </foreignObject>
          <path
            d={STAMP_PATH_D}
            fill="none"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="2"
          />
          <rect
            x="24"
            y="24"
            width={STAMP_WIDTH - 48}
            height={STAMP_HEIGHT - 48}
            rx="6"
            fill="none"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    );
  }

  if (isJson) {
    return (
      <div className="play-lightbox__pure-json">
        <pre className="play-lightbox__json-pre">
          {jsonContent
            ? JSON.stringify(jsonContent, null, 2)
            : jsonError
              ? `// Unable to load JSON from ${src}`
              : "// Loading JSON..."}
        </pre>
      </div>
    );
  }

  return (
    <div className="play-lightbox__stamp-wrapper">
      <svg
        viewBox={`0 0 ${STAMP_WIDTH} ${STAMP_HEIGHT}`}
        className="play-lightbox__stamp-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="lightbox-stamp-clip">
            <path d={STAMP_PATH_D} />
          </clipPath>
        </defs>
        {/* Dark foundation */}
        <path d={STAMP_PATH_D} fill="#14171d" />
        {/* 8:10 Artwork clipped into the perforated stamp */}
        <image
          href={src}
          width={STAMP_WIDTH}
          height={STAMP_HEIGHT}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#lightbox-stamp-clip)"
        />
        {/* Outer perforated contour border */}
        <path
          d={STAMP_PATH_D}
          fill="none"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="2"
        />
        {/* Inner delicate hairline stamp frame */}
        <rect
          x="24"
          y="24"
          width={STAMP_WIDTH - 48}
          height={STAMP_HEIGHT - 48}
          rx="6"
          fill="none"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
