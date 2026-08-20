import { useEffect, useId, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CenterFocusIcon } from "@hugeicons/core-free-icons";

function fetchImageProgress(src, onProgress, signal, highPriority = false) {
  return fetch(src, {
    signal,
    mode: "cors",
    credentials: "omit",
    priority: highPriority ? "high" : "auto",
  }).then(async (response) => {
    if (!response.ok) throw new Error("image load failed");

    const total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body?.getReader();
    if (!reader) {
      const blob = await response.blob();
      onProgress(1);
      return blob;
    }

    const chunks = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.byteLength;
      if (total > 0) onProgress(Math.min(received / total, 0.99));
    }

    onProgress(1);
    return new Blob(chunks, {
      type: response.headers.get("content-type") || "image/jpeg",
    });
  });
}

export default function WorkFrame({
  src,
  width,
  height,
  priority = false,
  allowLazy = true,
  onReady,
  decisions = [],
}) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const readySent = useRef(false);
  const objectUrlRef = useRef(null);
  const [activeSrc, setActiveSrc] = useState(priority ? src : null);
  const [displaySrc, setDisplaySrc] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [hideProgress, setHideProgress] = useState(false);
  const [lensOpen, setLensOpen] = useState(false);
  const panelId = useId();
  const hasDecisions = decisions.length > 0;
  const percent = Math.min(100, Math.round(progress * 100));

  const markReady = () => {
    setLoaded(true);
    setProgress(1);
    if (readySent.current) return;
    readySent.current = true;
    onReady?.();
  };

  useEffect(() => {
    if (priority) setActiveSrc(src);
  }, [priority, src]);

  // Nearby frames wait until the boot gate allows fetches — otherwise they
  // starve the first screenshot. Native lazy is not used once we opt in.
  useEffect(() => {
    if (activeSrc || !allowLazy) return;

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
      { rootMargin: "20% 0px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, activeSrc, allowLazy]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loaded || !inView) {
      setHideProgress(false);
      return;
    }

    const id = window.setTimeout(() => setHideProgress(true), 720);
    return () => window.clearTimeout(id);
  }, [loaded, inView]);

  useEffect(() => {
    if (!activeSrc) return;

    let alive = true;
    const controller = new AbortController();

    setProgress(0);
    setLoaded(false);
    setDisplaySrc(null);
    readySent.current = false;

    fetchImageProgress(
      activeSrc,
      (value) => {
        if (alive) setProgress(value);
      },
      controller.signal,
      priority
    )
      .then((blob) => {
        if (!alive) return;
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        setDisplaySrc(url);
      })
      .catch((error) => {
        if (!alive || error?.name === "AbortError") return;
        setDisplaySrc(activeSrc);
      });

    return () => {
      alive = false;
      controller.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [activeSrc]);

  // Cached images may already be complete before onLoad attaches.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !displaySrc) return;
    if (img.complete && img.naturalWidth > 0) {
      markReady();
    }
  }, [displaySrc]);

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
        hideProgress ? "is-progress-done" : "",
        lensOpen ? "is-lens-open" : "",
        hasDecisions ? "has-lens" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={!loaded && Boolean(activeSrc)}
      style={{
        "--frame-ar": width && height ? `${width} / ${height}` : "16 / 10",
      }}
      onClick={hasDecisions ? () => setLensOpen((open) => !open) : undefined}
    >
      {displaySrc ? (
        <img
          ref={imgRef}
          className="work-frame"
          src={displaySrc}
          alt=""
          width={width}
          height={height}
          decoding="async"
          loading="eager"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={markReady}
          onError={markReady}
        />
      ) : null}

      <span className="work-frame-progress" aria-hidden="true">
        {percent}
        <span className="work-frame-progress__unit">%</span>
      </span>

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
