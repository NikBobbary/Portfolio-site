import { useEffect, useRef } from "react";

const CLICKABLE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="native"]';

const HAND_MS = 420;

export default function Cursor() {
  const cursorRef = useRef(null);
  const coords = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const handTimer = useRef(0);
  const overClickable = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reduceMotion) return;

    const root = document.documentElement;
    const cursor = cursorRef.current;
    if (!cursor) return;

    root.classList.add("has-custom-cursor");

    const clearHandTimer = () => {
      if (handTimer.current) {
        window.clearTimeout(handTimer.current);
        handTimer.current = 0;
      }
    };

    const showHandBriefly = () => {
      clearHandTimer();
      root.classList.add("is-hand");
      handTimer.current = window.setTimeout(() => {
        root.classList.remove("is-hand");
        handTimer.current = 0;
      }, HAND_MS);
    };

    const render = () => {
      const { x, y } = coords.current;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf.current = 0;
    };

    const onPointerMove = (event) => {
      coords.current = { x: event.clientX, y: event.clientY };
      if (!raf.current) raf.current = requestAnimationFrame(render);

      const next = Boolean(event.target.closest(CLICKABLE));
      if (next && !overClickable.current) {
        showHandBriefly();
      }
      if (!next && overClickable.current) {
        clearHandTimer();
        root.classList.remove("is-hand");
      }
      overClickable.current = next;
      cursor.classList.toggle("is-mixing", next);
    };

    const onLeave = () => {
      overClickable.current = false;
      clearHandTimer();
      root.classList.remove("is-hand");
      cursor.classList.add("is-mixing");
    };

    const onEnter = () => {
      cursor.classList.remove("is-mixing");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      root.classList.remove("has-custom-cursor", "is-hand");
      clearHandTimer();
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={cursorRef} className="cursor is-mixing" aria-hidden="true" />;
}
