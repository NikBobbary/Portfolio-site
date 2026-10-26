import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { isPlaySubdomain, redirectToPlay } from "../utils/domain.js";
import { WORK_CASE_STUDIES } from "../data/workCases.js";
import "./ArcTransition.css";

/**
 * Check if the given pathname corresponds to a case study page.
 */
function isCaseStudyPath(pathname) {
  if (!pathname) return false;
  const trimmed = pathname.toLowerCase().replace(/\/+$/, "");
  if (!trimmed || trimmed === "/" || trimmed === "/work" || trimmed === "/play" || trimmed === "/project/lore") {
    return false;
  }
  if (
    trimmed.startsWith("/work/") ||
    trimmed.startsWith("/case/") ||
    trimmed.startsWith("/cases/") ||
    trimmed.startsWith("/~")
  ) {
    return true;
  }
  const clean = trimmed
    .replace(/^[~/]+/, "")
    .replace(/^work\//, "")
    .replace(/^cases?\//, "")
    .replace(/^projects?\//, "");

  return WORK_CASE_STUDIES.some(
    (item) => item.id.toLowerCase() === clean || item.slug.toLowerCase() === clean
  );
}

/**
 * Smootherstep interpolation with zero 1st and 2nd derivatives at endpoints.
 * Produces an ultra-fluid, soft, deliberate acceleration and deceleration without jerk.
 */
function smootherstep(min, max, val) {
  const x = Math.max(0, Math.min(1, (val - min) / (max - min)));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function triggerPlayTransition() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("start-arc-transition"));
  }
}

export default function ArcTransition() {
  const [isActive, setIsActive] = useState(false);
  const isRunningRef = useRef(false);
  const navigatedRef = useRef(false);
  const bottomTimerRef = useRef(null);

  const fillPathRef = useRef(null);
  const glowPathRef = useRef(null);
  const linePathRef = useRef(null);
  const portalRef = useRef(null);

  const location = useLocation();

  const isPlay = isPlaySubdomain();
  const isPlayRoute = isPlay || location.pathname.startsWith("/play") || location.pathname.startsWith("/~play");
  const isCaseStudy = isCaseStudyPath(location.pathname);

  // Clear any pending transitions if user navigates to a case study
  useEffect(() => {
    if (isCaseStudy) {
      if (bottomTimerRef.current) {
        clearTimeout(bottomTimerRef.current);
        bottomTimerRef.current = null;
      }
      isRunningRef.current = false;
      setIsActive(false);
    }
  }, [isCaseStudy]);

  const startTransition = useCallback(() => {
    if (isRunningRef.current) return;
    if (isPlayRoute || isCaseStudy) return;
    if (typeof document !== "undefined" && document.querySelector(".case-detail-page")) return;

    isRunningRef.current = true;
    navigatedRef.current = false;
    setIsActive(true);

    const DURATION = 1850; // Deliberate, peaceful, sophisticated duration (ms)
    let startTime = null;
    let animId = null;

    const tick = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(1.0, elapsed / DURATION);

      // 1. Calculate Endpoints yE (Left & Right points across screen)
      //    t in [0.00, 0.40]: Rises smoothly from bottom (1000) to 440 (upward arc)
      //    t in [0.40, 0.74]: Gently ascends from 440 to 180
      //    t in [0.74, 1.00]: Follows midpoint upward off top edge (180 to -60)
      let yE;
      if (t <= 0.40) {
        const p = smootherstep(0, 0.40, t);
        yE = 1000 - p * 560; // 1000 -> 440
      } else if (t <= 0.74) {
        const p = smootherstep(0.40, 0.74, t);
        yE = 440 - p * 260; // 440 -> 180
      } else {
        const p = smootherstep(0.74, 1.00, t);
        yE = 180 - p * 240; // 180 -> -60
      }

      // 2. Calculate Midpoint yM (Center of the screen)
      //    t in [0.00, 0.32]: Anchored firmly at the bottom edge (1000)
      //    t in [0.32, 0.74]: Rises smoothly from bottom (1000) to top edge (0), overtaking yE
      //    t in [0.74, 1.00]: Glides off top edge (0 to -60)
      let yM;
      if (t <= 0.32) {
        yM = 1000;
      } else if (t <= 0.74) {
        const p = smootherstep(0.32, 0.74, t);
        yM = 1000 - p * 1000; // 1000 -> 0
      } else {
        const p = smootherstep(0.74, 1.00, t);
        yM = 0 - p * 60; // 0 -> -60
      }

      // 3. Symmetric Cubic Bezier Control Point cy
      //    Ensures the midpoint is exactly yM with horizontal tangent
      const cy = (4 * yM - yE) / 3;

      // 4. Update SVG Path Strings
      const lineD = `M 0,${yE.toFixed(1)} C 360,${cy.toFixed(1)} 640,${cy.toFixed(1)} 1000,${yE.toFixed(1)}`;
      const fillD = `${lineD} L 1000,1050 L 0,1050 Z`;

      if (linePathRef.current) linePathRef.current.setAttribute("d", lineD);
      if (glowPathRef.current) glowPathRef.current.setAttribute("d", lineD);
      if (fillPathRef.current) fillPathRef.current.setAttribute("d", fillD);

      // Soft emergence opacity (remains solid black once screen is covered during transition)
      let opacity = 1.0;
      if (t < 0.08) {
        opacity = t / 0.08;
      }
      if (portalRef.current) {
        portalRef.current.style.opacity = opacity.toFixed(3);
      }

      // 5. Navigate to play subdomain when curtain fully covers the screen
      if (t >= 0.72 && !navigatedRef.current) {
        navigatedRef.current = true;
        redirectToPlay();
      }

      // 6. Complete motion
      if (t < 1.0) {
        animId = requestAnimationFrame(tick);
      } else {
        // Only unmount if not redirected
        if (!navigatedRef.current) {
          setIsActive(false);
          isRunningRef.current = false;
          if (portalRef.current) {
            portalRef.current.style.opacity = "0";
          }
        }
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlayRoute, isCaseStudy]);

  // Listen to trigger event from PlayProgressBar
  useEffect(() => {
    const handleCustomTrigger = () => {
      if (isCaseStudy || (typeof document !== "undefined" && document.querySelector(".case-detail-page"))) {
        return;
      }
      startTransition();
    };
    window.addEventListener("start-arc-transition", handleCustomTrigger);
    return () => {
      window.removeEventListener("start-arc-transition", handleCustomTrigger);
    };
  }, [startTransition, isCaseStudy]);

  if (!isActive) return null;

  return (
    <div ref={portalRef} className="arc-transition-portal" aria-hidden="true">
      <svg
        className="arc-transition-svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path ref={fillPathRef} className="arc-transition-curtain" />
        <path ref={glowPathRef} className="arc-transition-glow" />
        <path ref={linePathRef} className="arc-transition-line" />
      </svg>
    </div>
  );
}
