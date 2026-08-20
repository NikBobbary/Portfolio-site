import { useEffect, useRef } from "react";

const CLICKABLE =
  'a, button, [role="button"], input, textarea, select, label, summary, .shimeji, .hero__mark';

export default function Cursor() {
  const cursorRef = useRef(null);
  const coords = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

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

    const render = () => {
      const { x, y } = coords.current;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf.current = 0;
    };

    const onPointerMove = (event) => {
      coords.current = { x: event.clientX, y: event.clientY };
      if (!raf.current) raf.current = requestAnimationFrame(render);
      cursor.classList.toggle(
        "is-mixing",
        Boolean(event.target.closest(CLICKABLE))
      );
    };

    const onLeave = () => {
      cursor.classList.add("is-mixing");
    };

    const onEnter = () => {
      cursor.classList.remove("is-mixing");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      root.classList.remove("has-custom-cursor");
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={cursorRef} className="cursor is-mixing" aria-hidden="true" />;
}
