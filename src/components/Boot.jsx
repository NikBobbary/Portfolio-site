import { useEffect, useRef } from "react";

export default function Boot({ done, progress }) {
  const scrollRef = useRef(null);
  const percent = Math.min(100, Math.round(progress * 100));
  const complete = percent >= 100;

  useEffect(() => {
    const el = scrollRef.current;
    if (!done || !el) return;

    let frame = 0;
    const measure = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${next})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [done]);

  return (
    <div
      className={`boot${complete ? " is-complete" : ""}${done ? " is-done" : ""}`}
      aria-hidden={done}
      aria-busy={!done}
      aria-label={done ? undefined : "Loading work"}
      role={done ? undefined : "status"}
    >
      <p
        className="boot__percent"
        style={{ "--boot-p": `${percent}%` }}
        aria-hidden="true"
      >
        <span className="boot__cluster">
          <span className="boot__face boot__face--ghost">
            <span className="boot__count">{percent}</span>
            <span className="boot__unit">%</span>
          </span>
          <span className="boot__face boot__face--live">
            <span className="boot__count">{percent}</span>
            <span className="boot__unit">%</span>
          </span>
        </span>
      </p>

      <div className="boot__bar" aria-hidden="true">
        <span
          className="boot__fill"
          style={{ transform: `scaleX(${complete ? 1 : progress})` }}
        />
        <span ref={scrollRef} className="boot__scroll" />
      </div>
    </div>
  );
}
