import { useCallback, useEffect, useRef, useState } from "react";

const SUFFIX = "itha Bobbary";
const TICK_MS = 55;

export default function HeroName() {
  const [len, setLen] = useState(0);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return () => window.clearInterval(timerRef.current);
  }, []);

  const stop = useCallback(() => {
    window.clearInterval(timerRef.current);
    timerRef.current = 0;
    setOpen(false);
    setLen(0);
  }, []);

  const start = useCallback(() => {
    window.clearInterval(timerRef.current);
    setOpen(true);
    if (reduceRef.current) {
      setLen(SUFFIX.length);
      return;
    }
    setLen(0);
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= SUFFIX.length) {
        window.clearInterval(timerRef.current);
        timerRef.current = 0;
      }
    }, TICK_MS);
  }, []);

  return (
    <span
      className={`hero__who${open ? " is-open" : ""}`}
      onPointerEnter={start}
      onPointerLeave={stop}
    >
      <span className="hero__who-slot hero__who-slot--lead" aria-hidden="true" />
      <span className="hero__emph">
        Nik
        <span className="hero__who-rest">{SUFFIX.slice(0, len)}</span>
      </span>
      <span className="hero__who-slot hero__who-slot--tail" aria-hidden="true" />
      <img
        className="hero__mark"
        src="/nikitha-avatar.jpg"
        alt=""
        width={48}
        height={48}
        draggable={false}
      />
    </span>
  );
}
