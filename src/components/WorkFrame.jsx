import { useEffect, useId, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CenterFocusIcon } from "@hugeicons/core-free-icons";

export default function WorkFrame({
  src,
  width,
  height,
  priority = false,
  decisions = [],
}) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const [activeSrc, setActiveSrc] = useState(priority ? src : null);
  const [loaded, setLoaded] = useState(false);
  const [lensOpen, setLensOpen] = useState(false);
  const panelId = useId();
  const hasDecisions = decisions.length > 0;

  useEffect(() => {
    if (priority) setActiveSrc(src);
  }, [priority, src]);

  // Start fetching once the frame is near the viewport (skip if already active).
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
      { rootMargin: "160% 0px", threshold: 0.01 }
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
        lensOpen ? "is-lens-open" : "",
        hasDecisions ? "has-lens" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--frame-ar": width && height ? `${width} / ${height}` : "16 / 10",
      }}
      onClick={hasDecisions ? () => setLensOpen((open) => !open) : undefined}
    >
      {activeSrc ? (
        <img
          ref={imgRef}
          className="work-frame"
          src={activeSrc}
          alt=""
          width={width}
          height={height}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      ) : null}

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
