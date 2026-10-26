import { useEffect, useRef, useState } from "react";

/**
 * WavyPixelCanvas
 *
 * High-performance WebGL shader component that creates an interactive
 * wavy pixel resolve effect on case study card hover:
 * - On hover, initiates with dynamic wavy pixel blocks and fluid ripples
 * - Over exactly 800ms, the pixel sizes reduce down to 1:1 and waves settle
 * - The actual high-clarity image arises seamlessly at the 800ms mark
 * - When hover ends, gracefully resets so re-entering triggers the resolve again
 * - Zero GPU/CPU overhead when idle
 */

const VERTEX_SHADER_SRC = `
attribute vec2 aPosition;
attribute vec2 aUV;
varying vec2 vUV;

void main() {
  vUV = aUV;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;

varying vec2 vUV;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uTime;
uniform float uProgress;    // 0.0 at hover start, 1.0 at 800ms
uniform vec2 uMouse;
uniform float uMaxPixelSize;

// Computes UV coordinates matching CSS object-fit: cover with object-position: top center
vec2 getCoverUV(vec2 uv) {
  float containerAspect = uResolution.x / uResolution.y;
  float imageAspect = uImageResolution.x / uImageResolution.y;
  vec2 uvCover = uv;
  if (containerAspect > imageAspect) {
    // Container is wider than image:
    // Full width fits container, vertical is cropped from top
    float s = imageAspect / containerAspect;
    uvCover.y = uv.y * s;
  } else {
    // Container is taller/narrower than image:
    // Full height fits container, horizontal is cropped and centered
    float s = containerAspect / imageAspect;
    uvCover.x = (uv.x - 0.5) * s + 0.5;
  }
  return clamp(uvCover, 0.0, 1.0);
}

void main() {
  vec2 uv = vUV;

  // Decay factor: starts at 1.0, decays to 0.0 at 800ms
  float decay = clamp(1.0 - uProgress, 0.0, 1.0);

  // Smooth ease-out curve for pixel reduction (e.g. cubic ease-out)
  float pixelEase = 1.0 - pow(decay, 2.4);

  // Pixel sizes reduce from uMaxPixelSize down to 1.0 (native pixel clarity)
  float currentPixelSize = mix(uMaxPixelSize, 1.0, pixelEase);
  vec2 numBlocks = max(uResolution / currentPixelSize, vec2(1.0));

  // Discrete cell coordinate (causes pixels to wave as solid digital blocks)
  vec2 cellIndex = floor(uv * numBlocks);
  vec2 cellCenter = (cellIndex + 0.5) / numBlocks;

  // Primary harmonic waves traversing diagonally (damped by decay)
  float w1 = sin(cellCenter.y * 14.0 - uTime * 4.5 + cellCenter.x * 6.0);
  float w2 = cos(cellCenter.x * 16.0 + uTime * 3.8 - cellCenter.y * 7.0);
  vec2 ambientWave = vec2(w1, w2) * (0.020 * decay);

  // Secondary cross-undulation for rich liquid motion
  float w3 = sin((cellCenter.x + cellCenter.y) * 18.0 - uTime * 3.0);
  vec2 subWave = vec2(w3 * 0.5, -w3 * 0.5) * (0.010 * decay);

  // Interactive ripple radiating from cursor touchpoint
  vec2 mouseDelta = (cellCenter - uMouse) * vec2(uResolution.x / uResolution.y, 1.0);
  float dist = length(mouseDelta);
  float ripple = sin(dist * 26.0 - uTime * 7.5) * exp(-dist * 3.0);
  vec2 mouseWave = (dist > 0.001 ? normalize(mouseDelta) : vec2(0.0)) * (ripple * 0.022 * decay);

  // Total displacement vector decaying to 0 at 800ms
  vec2 totalDisplacement = ambientWave + subWave + mouseWave;
  vec2 sampledCellUV = cellCenter + totalDisplacement;

  // Chromatic dispersion (RGB offset decaying to 0 at 800ms)
  vec2 dispDir = totalDisplacement * 0.55;
  vec2 uvR = getCoverUV(sampledCellUV + dispDir);
  vec2 uvG = getCoverUV(sampledCellUV);
  vec2 uvB = getCoverUV(sampledCellUV - dispDir);

  float r = texture2D(uTexture, uvR).r;
  float g = texture2D(uTexture, uvG).g;
  float b = texture2D(uTexture, uvB).b;
  vec3 pixelColor = vec3(r, g, b);

  // Subtle digital pixel grid matrix line (fades away as pixel size reaches 1.0)
  vec2 subPixel = fract(uv * numBlocks);
  float border = smoothstep(0.0, 0.08, subPixel.x) * smoothstep(1.0, 0.92, subPixel.x) *
                 smoothstep(0.0, 0.08, subPixel.y) * smoothstep(1.0, 0.92, subPixel.y);
  float gridLine = mix(0.88, 1.0, border);

  // Specular luminescence shimmer on wave crests
  float crest = clamp((totalDisplacement.x + totalDisplacement.y) * 35.0, -0.12, 0.12);
  vec3 livingPixelColor = pixelColor * mix(1.0, gridLine, decay * 0.6) + vec3(crest * decay);

  // Pristine high-clarity image
  vec3 highClarityColor = texture2D(uTexture, getCoverUV(uv)).rgb;

  // High clarity image arises as pixel sizes reduce (100% actual image at 800ms)
  vec3 finalColor = mix(livingPixelColor, highClarityColor, uProgress);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const RESOLVE_DURATION_MS = 800; // 800ms transition to high clarity

export default function WavyPixelCanvas({
  src,
  alt = "",
  naturalWidth,
  naturalHeight,
  maxPixelSize = 22.0,
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const glRef = useRef(null);
  const programRef = useRef(null);
  const textureRef = useRef(null);
  const uniformsRef = useRef({});
  const imgMetaRef = useRef({
    width: naturalWidth || 2400,
    height: naturalHeight || 1500,
  });

  const isHoveredRef = useRef(false);
  const hoverStartTimeRef = useRef(null);
  const progressRef = useRef(0.0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Honor prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Initialize WebGL context (WebGL2 preferred for NPOT mipmaps, WebGL1 fallback)
    const gl =
      canvas.getContext("webgl2", {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }) ||
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }) ||
      canvas.getContext("experimental-webgl");

    if (!gl) {
      console.warn("[WavyPixelCanvas] WebGL not supported, fallback to CSS.");
      return;
    }
    glRef.current = gl;

    // Shader compilation helper
    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("[WavyPixelCanvas] Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[WavyPixelCanvas] Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;
    gl.useProgram(program);

    // Geometry: Full-screen quad (6 vertices)
    const vertices = new Float32Array([
      // pos.x, pos.y, uv.x, uv.y
      -1.0,  1.0, 0.0, 0.0,
      -1.0, -1.0, 0.0, 1.0,
       1.0,  1.0, 1.0, 0.0,
       1.0,  1.0, 1.0, 0.0,
      -1.0, -1.0, 0.0, 1.0,
       1.0, -1.0, 1.0, 1.0,
    ]);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    const aUV = gl.getAttribLocation(program, "aUV");

    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(aUV);
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 16, 8);

    // Uniform locations
    uniformsRef.current = {
      uTexture: gl.getUniformLocation(program, "uTexture"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uImageResolution: gl.getUniformLocation(program, "uImageResolution"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uProgress: gl.getUniformLocation(program, "uProgress"),
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uMaxPixelSize: gl.getUniformLocation(program, "uMaxPixelSize"),
    };

    // Create & upload image texture
    const texture = gl.createTexture();
    textureRef.current = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let isDisposed = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const handleImgLoad = () => {
      if (isDisposed || !glRef.current) return;
      imgMetaRef.current = {
        width: img.naturalWidth || naturalWidth || 2400,
        height: img.naturalHeight || naturalHeight || 1500,
      };

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      const isWebGL2 =
        typeof WebGL2RenderingContext !== "undefined" &&
        gl instanceof WebGL2RenderingContext;
      const isPOT =
        (img.naturalWidth & (img.naturalWidth - 1)) === 0 &&
        (img.naturalHeight & (img.naturalHeight - 1)) === 0;

      if (isWebGL2 || isPOT) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR
        );
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }

      setIsReady(true);
      resizeCanvas();
      drawSingleFrame(0.0);
    };

    if (img.complete && img.naturalWidth > 0) {
      handleImgLoad();
    } else {
      img.onload = handleImgLoad;
    }

    // Resize handling
    const resizeCanvas = () => {
      if (!canvas || !glRef.current) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      glRef.current.viewport(0, 0, canvas.width, canvas.height);
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      if (isHoveredRef.current) {
        drawSingleFrame(progressRef.current);
      }
    });
    resizeObserver.observe(canvas);

    // Frame rendering function
    const drawSingleFrame = (progressValue) => {
      const gl = glRef.current;
      const program = programRef.current;
      const uniforms = uniformsRef.current;
      if (!gl || !program || !textureRef.current) return;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
      gl.uniform1i(uniforms.uTexture, 0);

      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform2f(
        uniforms.uImageResolution,
        imgMetaRef.current.width,
        imgMetaRef.current.height
      );

      const elapsedSec = (performance.now() - startTimeRef.current) * 0.001;
      gl.uniform1f(uniforms.uTime, elapsedSec);
      gl.uniform1f(uniforms.uProgress, progressValue);

      // Smooth mouse position
      gl.uniform2f(uniforms.uMouse, mouseRef.current.x, mouseRef.current.y);

      // Scaled max pixel size based on DPR
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      gl.uniform1f(uniforms.uMaxPixelSize, maxPixelSize * dpr);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // 400ms Animation Loop
    const tick = (now) => {
      if (!isHoveredRef.current) {
        rafIdRef.current = null;
        return;
      }

      if (!hoverStartTimeRef.current) {
        hoverStartTimeRef.current = now;
      }

      const elapsedMs = now - hoverStartTimeRef.current;
      const progress = Math.min(1.0, Math.max(0.0, elapsedMs / RESOLVE_DURATION_MS));
      progressRef.current = progress;

      // Smooth mouse follower
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.2;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.2;

      // Render frame with current progress
      drawSingleFrame(progress);

      if (progress < 1.0 && isHoveredRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        // High clarity image reached at 400ms: loop can rest
        rafIdRef.current = null;
      }
    };

    const startResolveAnimation = () => {
      if (!startTimeRef.current) {
        startTimeRef.current = performance.now();
      }
      hoverStartTimeRef.current = performance.now();
      progressRef.current = 0.0;
      setIsActive(true);

      // Draw initial frame at progress = 0.0 immediately
      drawSingleFrame(0.0);

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    // Mouse & Pointer listeners on the parent Case Study Card
    const cardEl = canvas.closest(".case-card") || canvas.parentElement;

    const handlePointerEnter = (e) => {
      isHoveredRef.current = true;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouseRef.current = {
          x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
          y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
        };
        mouseRef.current = { ...targetMouseRef.current };
      }
      startResolveAnimation();
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouseRef.current = {
          x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
          y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
        };
      }
    };

    const handlePointerLeave = () => {
      isHoveredRef.current = false;
      hoverStartTimeRef.current = null;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      // Fade canvas out smoothly back to resting img
      setIsActive(false);
    };

    if (cardEl) {
      cardEl.addEventListener("pointerenter", handlePointerEnter, { passive: true });
      cardEl.addEventListener("pointermove", handlePointerMove, { passive: true });
      cardEl.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    }

    return () => {
      isDisposed = true;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      resizeObserver.disconnect();

      if (cardEl) {
        cardEl.removeEventListener("pointerenter", handlePointerEnter);
        cardEl.removeEventListener("pointermove", handlePointerMove);
        cardEl.removeEventListener("pointerleave", handlePointerLeave);
      }

      if (gl) {
        if (texture) gl.deleteTexture(texture);
        if (vbo) gl.deleteBuffer(vbo);
        if (program) gl.deleteProgram(program);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
      }
    };
  }, [src, maxPixelSize]);

  return (
    <div ref={containerRef} className="wavy-pixel-wrapper" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={`wavy-pixel-canvas ${isActive && isReady ? "is-active" : ""} ${className}`.trim()}
        role="presentation"
      />
    </div>
  );
}
