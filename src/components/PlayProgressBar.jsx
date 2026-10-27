import { useEffect, useRef, useState, useCallback } from "react";
import { triggerPlayTransition } from "./ArcTransition.jsx";
import { isPlaySubdomain } from "../utils/domain.js";
import "./PlayProgressBar.css";

/**
 * PlayProgressBar
 * 
 * An elegant, tactile scroll-through progress bar gateway to the Play page.
 * Replaces the automatic footer trigger with a deliberate, smooth progress indicator
 * that fills as the user scrolls into and through the bottom section of the page.
 * When 100% scrolled through, it triggers the fluid arc transition directly to play.~
 */
export default function PlayProgressBar() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isCompletedRef = useRef(false);
  const accumulatorRef = useRef(0);
  const animFrameRef = useRef(null);
  const touchStartYRef = useRef(0);

  const isPlay = isPlaySubdomain();

  // Launch transition once 100% reached
  const completeAndLaunch = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setIsCompleted(true);
    setProgress(1.0);
    triggerPlayTransition();
  }, []);

  // Manual click/tap to fill smoothly and launch
  const handleManualTrigger = useCallback(() => {
    if (isCompletedRef.current) return;
    let start = null;
    const initialProgress = progress;
    const DURATION = 380; // ms

    const animateClickFill = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      const t = Math.min(1.0, elapsed / DURATION);
      const ease = t * (2 - t); // easeOutQuad
      const current = initialProgress + (1.0 - initialProgress) * ease;
      setProgress(current);

      if (t < 1.0) {
        requestAnimationFrame(animateClickFill);
      } else {
        completeAndLaunch();
      }
    };

    requestAnimationFrame(animateClickFill);
  }, [progress, completeAndLaunch]);

  // Main scroll & overscroll calculation loop
  useEffect(() => {
    if (isPlay || isCompletedRef.current) return;

    const RUNWAY_PX = 240; // Pixels of scroll travel allocated to filling the runway
    const MAX_PULL_PX = 180; // Additional physical overscroll pull needed if already at bottom

    const updateScrollProgress = () => {
      if (isCompletedRef.current) return;

      const docEl = document.documentElement;
      const scrollY = window.scrollY || docEl.scrollTop || 0;
      const windowH = window.innerHeight;
      const docH = docEl.scrollHeight;
      const maxScroll = Math.max(1, docH - windowH);

      // 1. Natural Scroll Runway: Last RUNWAY_PX of the page fills 0.0 -> 0.75
      const runwayStart = Math.max(0, maxScroll - RUNWAY_PX);
      let runwayRatio = 0;
      if (scrollY >= runwayStart) {
        runwayRatio = Math.min(1.0, (scrollY - runwayStart) / (maxScroll - runwayStart || 1));
      }

      // 2. Overscroll Pull: Extra wheel/touch pull fills the remaining 0.25 to 1.0
      const pullRatio = Math.min(1.0, accumulatorRef.current / MAX_PULL_PX);

      // Combined progress:
      // - Scrolling naturally through the bottom fills up to 75%
      // - Completing the scroll gesture or pulling through reaches 100%
      let total = runwayRatio * 0.75 + pullRatio * 0.40;
      total = Math.max(0, Math.min(1.0, total));

      setProgress((prev) => {
        // Fast response when advancing, smooth when declining
        return total >= prev ? total : prev * 0.95 + total * 0.05;
      });

      if (total >= 0.99 && !isCompletedRef.current) {
        completeAndLaunch();
      }
    };

    // Lenis listener
    if (window.lenis) {
      window.lenis.on("scroll", updateScrollProgress);
    }
    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    // Wheel listener for pull-through at bottom
    const handleWheel = (e) => {
      if (isCompletedRef.current) return;
      const docEl = document.documentElement;
      const scrollY = window.scrollY || docEl.scrollTop || 0;
      const windowH = window.innerHeight;
      const docH = docEl.scrollHeight;
      const atBottom = scrollY + windowH >= docH - 16;

      if (e.deltaY > 0) {
        if (atBottom) {
          accumulatorRef.current = Math.min(220, accumulatorRef.current + e.deltaY * 0.85);
          updateScrollProgress();
        }
      } else if (e.deltaY < 0) {
        accumulatorRef.current = Math.max(0, accumulatorRef.current + e.deltaY * 1.2);
        updateScrollProgress();
      }
    };

    // Touch listeners for mobile pull-through
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (isCompletedRef.current || e.touches.length !== 1) return;
      const docEl = document.documentElement;
      const scrollY = window.scrollY || docEl.scrollTop || 0;
      const windowH = window.innerHeight;
      const docH = docEl.scrollHeight;
      const atBottom = scrollY + windowH >= docH - 24;

      if (atBottom) {
        const delta = touchStartYRef.current - e.touches[0].clientY; // positive = swipe up to pull
        if (delta > 0) {
          accumulatorRef.current = Math.min(220, accumulatorRef.current + delta * 0.9);
          updateScrollProgress();
        }
      }
    };

    // Smooth accumulator decay loop (springs back to 0 if user stops pulling without reaching 100%)
    const decayAccumulator = () => {
      if (!isCompletedRef.current && accumulatorRef.current > 0.5) {
        accumulatorRef.current *= 0.91; // Smooth dampening
        updateScrollProgress();
      }
      animFrameRef.current = requestAnimationFrame(decayAccumulator);
    };
    animFrameRef.current = requestAnimationFrame(decayAccumulator);

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      if (window.lenis) {
        window.lenis.off("scroll", updateScrollProgress);
      }
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlay, completeAndLaunch]);

  if (isPlay) return null;

  const displayPercent = Math.min(100, Math.round(progress * 100));

  return (
    <div
      ref={containerRef}
      className={`play-progress-gate${isCompleted ? " is-completed" : ""}${isHovered ? " is-hovered" : ""}`}
      onClick={handleManualTrigger}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      role="progressbar"
      aria-valuenow={displayPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Scroll through progress bar to enter Play"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleManualTrigger();
        }
      }}
    >
      <div className="play-progress-gate__card">
        <div className="play-progress-gate__header">
          <span className="play-progress-gate__label">
            <span className="play-progress-gate__dot" aria-hidden="true" />
            Play
          </span>
          <span className="play-progress-gate__count" aria-hidden="true">
            {String(displayPercent).padStart(2, "0")}%
          </span>
        </div>

        <div className="play-progress-gate__track" aria-hidden="true">
          <div
            className="play-progress-gate__fill"
            style={{
              transform: `scaleX(${progress})`,
            }}
          />
        </div>

        <div className="play-progress-gate__footer">
          <span className="play-progress-gate__hint">
            {isCompleted
              ? "Entering Play..."
              : progress > 0.05
              ? "Keep scrolling to release"
              : "Scroll through to enter Play"}
          </span>
          <span
            className="play-progress-gate__arrow"
            style={{
              transform: `translateY(${Math.min(4, progress * 4)}px)`,
              opacity: 0.35 + progress * 0.65,
            }}
            aria-hidden="true"
          >
            ↓
          </span>
        </div>
      </div>
    </div>
  );
}
