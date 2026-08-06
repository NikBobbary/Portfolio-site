import { useEffect, useId, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CenterFocusIcon } from "@hugeicons/core-free-icons";

export default function WorkFrame({
  src,
  priority = false,
  decisions = [],
}) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const [activeSrc, setActiveSrc] = useState(priority ? src : null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [lensOpen, setLensOpen] = useState(false);
  const panelId = useId();
  const hasDecisions = decisions.length > 0;
  const revealed = inView && loaded;

  // Start fetching once the frame is near the viewport (skip if priority).
  useEffect(() => {
    if (activeSrc) return;

    const el = wrapRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setActiveSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActiveSrc(src);
        observer.disconnect();
      },
      { rootMargin: "140% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, activeSrc]);

  // Cached images may already be complete before onLoad attaches.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !activeSrc) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [activeSrc]);

  // Unblur only after the image is both loaded and meaningfully on screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.06, rootMargin: "12% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lensOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setLensOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lensOpen]);

  return (
    <div
      ref={wrapRef}
      className={[
        "work-frame-wrap",
        loaded ? "is-loaded" : "is-loading",
        revealed ? "is-visible" : "",
        lensOpen ? "is-lens-open" : "",
        hasDecisions ? "has-lens" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={hasDecisions ? () => setLensOpen((open) => !open) : undefined}
    >
      {activeSrc ? (
        <img
          ref={imgRef}
          className="work-frame"
          src={activeSrc}
          alt=""
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      ) : (
        <div className="work-frame work-frame--slot" aria-hidden="true" />
      )}

      {hasDecisions ? (
        <>
          <button
            type="button"
            className="work-lens-btn"
            aria-expanded={lensOpen}
            aria-controls={panelId}
            aria-label={lensOpen ? "Hide decisions" : "Show decisions"}
            data-tooltip={
              lensOpen ? "Hide design decisions" : "Show design decisions"
            }
            data-tooltip-place="below"
          >
            <HugeiconsIcon
              icon={lensOpen ? Cancel01Icon : CenterFocusIcon}
              size={16}
              strokeWidth={1}
            />
            {lensOpen ? null : <span>Decisions</span>}
          </button>

          <div
            id={panelId}
            className={`work-lens${lensOpen ? " is-open" : ""}`}
            aria-hidden={!lensOpen}
          >
            <div className="work-lens__veil" aria-hidden="true" />
            {decisions.map((decision, index) => (
              <div
                key={`${src}-decision-${index}`}
                className="work-callout"
                style={{
                  "--x": decision.x,
                  "--y": decision.y,
                  "--i": index,
                }}
              >
                <span className="work-callout__pin" aria-hidden="true" />
                <p className="work-callout__text">{decision.text}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
