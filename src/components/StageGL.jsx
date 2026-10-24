import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * StageGL: WebGL2 Curved Mesh Renderer (Option 1)
 *
 * Implements the real-time cylindrical fold vertex shader directly derived
 * from Sasha Martynchuk's portfolio (sashamartynchuk.com).
 *
 * Each card is rendered as a 3D subdivision mesh (16 cols x 48 rows):
 * - Vertices above the fold line (~22vh from bottom) remain 100% flat (Z = 0).
 * - Vertices below the fold line physically bend backward along the cylinder curve.
 * - Produces the authentic visual of paper/cards feeding out of a curved roll.
 */

const VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 aUV;

uniform vec2  uRes;        
uniform vec4  uRect;       
uniform vec2  uCover;      

uniform float uZone;       
uniform float uAngle;      
uniform float uRound;      
uniform float uDir;        
uniform float uPersp;      

uniform float uXFlat;      
uniform float uXAngle;
uniform float uXRound;
uniform float uXDir;       
uniform vec2  uFade;       

out vec2 vUV;      
out vec2 vQuad;    
out float vFade;

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
  vUV = (aUV - 0.5) * uCover + 0.5;
  vQuad = aUV;

  vec2 p = uRect.xy + aUV * uRect.zw;

  float line = uRes.y - uZone;
  vec2 fy = foldAt(p.y - line, uAngle, uRound);
  float y = p.y > line ? line + fy.x : p.y;
  float z = (p.y > line ? fy.y : 0.0) * uDir;

  float cx = uRes.x * 0.5;
  float dx = p.x - cx;
  vec2 fx = foldAt(abs(dx) - uXFlat, uXAngle, uXRound);
  float x = abs(dx) > uXFlat ? cx + sign(dx) * (uXFlat + fx.x) : p.x;
  z += (abs(dx) > uXFlat ? fx.y : 0.0) * uXDir;

  vec2 eye = vec2(cx, uRes.y * 0.5);
  
  float k = uPersp / max(uPersp - z, uPersp * 0.25);
  vec2 sp = eye + (vec2(x, y) - eye) * k;

  vFade = 1.0 - smoothstep(uFade.x, uFade.y, abs(z));

  float depth = clamp(0.5 - z / 12000.0, 0.0, 0.999);
  gl_Position = vec4(sp.x / uRes.x * 2.0 - 1.0, 1.0 - sp.y / uRes.y * 2.0, depth, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUV;
in vec2 vQuad;
in float vFade;

uniform sampler2D uTex;
uniform vec2  uSize;       
uniform float uRadius;
uniform float uAlpha;
uniform float uHasTex;

out vec4 frag;

void main() {
  vec2 q = abs((vQuad - 0.5) * uSize) - (uSize * 0.5 - uRadius);
  float d = length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - uRadius;
  float aa = max(fwidth(d), 0.0001);
  float mask = 1.0 - smoothstep(-aa, aa, d);

  vec3 rgb = uHasTex > 0.5 ? texture(uTex, vUV).rgb : vec3(0.06);

  vec2 fw = fwidth(vUV) + 1e-6;
  vec2 lo = smoothstep(vec2(0.0), fw, vUV);
  vec2 hi = smoothstep(vec2(0.0), fw, vec2(1.0) - vUV);
  float inside = lo.x * lo.y * hi.x * hi.y;
  rgb = mix(vec3(0.02), rgb, inside);

  float a = mask * uAlpha * clamp(vFade, 0.0, 1.0);
  frag = vec4(rgb * a, a);
}`;

const COLS = 16;
const ROWS = 48;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[StageGL] shader error:", gl.getShaderInfoLog(shader));
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

export default function StageGL() {
  const canvasRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      depth: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.warn("[StageGL] WebGL2 not supported, falling back to CSS.");
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
      console.error("[StageGL] link error:", gl.getProgramInfoLog(program));
      return;
    }

    const uniforms = {
      uRes: gl.getUniformLocation(program, "uRes"),
      uRect: gl.getUniformLocation(program, "uRect"),
      uCover: gl.getUniformLocation(program, "uCover"),
      uZone: gl.getUniformLocation(program, "uZone"),
      uAngle: gl.getUniformLocation(program, "uAngle"),
      uRound: gl.getUniformLocation(program, "uRound"),
      uDir: gl.getUniformLocation(program, "uDir"),
      uPersp: gl.getUniformLocation(program, "uPersp"),
      uXFlat: gl.getUniformLocation(program, "uXFlat"),
      uXAngle: gl.getUniformLocation(program, "uXAngle"),
      uXRound: gl.getUniformLocation(program, "uXRound"),
      uXDir: gl.getUniformLocation(program, "uXDir"),
      uFade: gl.getUniformLocation(program, "uFade"),
      uTex: gl.getUniformLocation(program, "uTex"),
      uSize: gl.getUniformLocation(program, "uSize"),
      uRadius: gl.getUniformLocation(program, "uRadius"),
      uAlpha: gl.getUniformLocation(program, "uAlpha"),
      uHasTex: gl.getUniformLocation(program, "uHasTex"),
    };

    const mesh = createMesh(gl);
    const textureMap = new Map();

    const getTexture = (el) => {
      if (el.tagName === "IMG") {
        const src = el.currentSrc || el.src;
        if (!src) return null;
        if (textureMap.has(src)) return textureMap.get(src);

        if (!el.complete || el.naturalWidth === 0) {
          el.addEventListener("load", requestTick, { once: true });
          return null;
        }

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, el);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);

        textureMap.set(src, tex);
        return tex;
      }

      if (el.tagName.toLowerCase() === "svg" || el.classList.contains("contact__brand-svg")) {
        const key = "footer_brand_svg";
        if (textureMap.has(key)) return textureMap.get(key);

        try {
          let xml = new XMLSerializer().serializeToString(el);
          if (!xml.includes('width="')) {
            xml = xml.replace("<svg", '<svg width="843" height="97"');
          }
          const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            try {
              const tex = gl.createTexture();
              gl.bindTexture(gl.TEXTURE_2D, tex);
              gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
              gl.bindTexture(gl.TEXTURE_2D, null);
              textureMap.set(key, tex);
              requestTick();
            } catch (err) {
              console.warn("[StageGL] SVG texture binding error:", err);
            } finally {
              URL.revokeObjectURL(url);
            }
          };
          img.onerror = (err) => {
            console.warn("[StageGL] SVG image load error:", err);
            URL.revokeObjectURL(url);
          };
          img.src = url;
        } catch (err) {
          console.warn("[StageGL] SVG texture error:", err);
        }
        return null;
      }

      return null;
    };

    let ticking = false;
    let renderedElements = new Set();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const GL_SELECTOR = [
      // Snapshots showcase (WebGL curved cylinder mesh)
      ".work-frame",
      ".work-shot img",
    ].join(", ");

    const render = () => {
      ticking = false;
      resizeCanvas();

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      gl.useProgram(program);

      const dpr = window.devicePixelRatio || 1;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Global cylinder fold parameters
      const foldZone = vh * 0.22; // roughly 20-22vh from bottom
      const foldAngle = 38 * (Math.PI / 180); // 38 deg
      const foldRound = 240;
      const xFlat = Math.max(vw * 0.44, 380);

      gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
      gl.uniform1f(uniforms.uZone, foldZone * dpr);
      gl.uniform1f(uniforms.uAngle, foldAngle);
      gl.uniform1f(uniforms.uRound, foldRound * dpr);
      gl.uniform1f(uniforms.uDir, 1.0);
      gl.uniform1f(uniforms.uPersp, 900.0 * dpr);

      // Horizontal subtle curve on the sides
      gl.uniform1f(uniforms.uXFlat, xFlat * dpr);
      gl.uniform1f(uniforms.uXAngle, 12 * (Math.PI / 180));
      gl.uniform1f(uniforms.uXRound, 400.0 * dpr);
      gl.uniform1f(uniforms.uXDir, 1.0);
      gl.uniform2f(uniforms.uFade, 140.0 * dpr, 680.0 * dpr);

      gl.bindVertexArray(mesh.vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(uniforms.uTex, 0);

      const elements = Array.from(new Set(document.querySelectorAll(GL_SELECTOR)));
      const currentInView = new Set();

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const rect = el.getBoundingClientRect();

        // Cull if outside viewport
        if (rect.bottom < -50 || rect.top > vh + 100) continue;
        if (rect.width <= 0 || rect.height <= 0) continue;

        const tex = getTexture(el);
        if (!tex) {
          // If texture not yet decoded, keep standard element visible
          continue;
        }

        currentInView.add(el);
        if (!el.classList.contains("is-gl-rendered")) {
          el.classList.add("is-gl-rendered");
        }

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1f(uniforms.uHasTex, 1.0);

        gl.uniform4f(
          uniforms.uRect,
          rect.left * dpr,
          rect.top * dpr,
          rect.width * dpr,
          rect.height * dpr
        );

        // Aspect ratio cover
        const frameAspect = rect.width / rect.height;
        const naturalW = el.naturalWidth || el.viewBox?.baseVal?.width || rect.width;
        const naturalH = el.naturalHeight || el.viewBox?.baseVal?.height || rect.height;
        const imgAspect = naturalW / naturalH;
        let coverX = 1.0;
        let coverY = 1.0;
        if (frameAspect > imgAspect) {
          coverY = imgAspect / frameAspect;
        } else {
          coverX = frameAspect / imgAspect;
        }
        gl.uniform2f(uniforms.uCover, coverX, coverY);

        gl.uniform2f(uniforms.uSize, rect.width * dpr, rect.height * dpr);

        let radius = 24.0 * dpr;
        if (el.classList.contains("like__portrait") || el.tagName === "svg" || el.classList.contains("contact__brand-svg")) {
          radius = 0.0;
        } else if (el.classList.contains("screen-mockup-image")) {
          radius = 14.0 * dpr;
        }
        gl.uniform1f(uniforms.uRadius, radius);
        gl.uniform1f(uniforms.uAlpha, 1.0);

        gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
      }

      // Cleanup elements that left view
      for (const el of renderedElements) {
        if (!currentInView.has(el)) {
          el.classList.remove("is-gl-rendered");
        }
      }
      renderedElements = currentInView;

      gl.bindVertexArray(null);
      gl.bindTexture(gl.TEXTURE_2D, null);
    };

    const requestTick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    };

    requestTick();

    const mo = new MutationObserver(() => {
      requestTick();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("load", requestTick, { passive: true, capture: true });

    if (window.lenis) {
      window.lenis.on("scroll", requestTick);
    }
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });

    return () => {
      mo.disconnect();
      window.removeEventListener("load", requestTick, { capture: true });
      if (window.lenis) {
        window.lenis.off("scroll", requestTick);
      }
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);

      for (const el of renderedElements) {
        el.classList.remove("is-gl-rendered");
      }

      textureMap.forEach((tex) => gl.deleteTexture(tex));
      textureMap.clear();

      gl.deleteBuffer(mesh.vbo);
      gl.deleteBuffer(mesh.ebo);
      gl.deleteVertexArray(mesh.vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [location.pathname]);

  return (
    <canvas
      ref={canvasRef}
      className="stage-gl"
      aria-hidden="true"
    />
  );
}
