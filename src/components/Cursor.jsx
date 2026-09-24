import { useEffect, useRef } from "react";

const CLICKABLE =
  'a, button, [role="button"], input, textarea, select, label, summary, .shimeji, .hero__mark, .hero__emph, .hero__who, .hero__zero, .hero__place, .locale-card, .work-header__name, .like__portrait-wrap';

export default function Cursor() {
  const cursorRef = useRef(null);
  const coords = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const onPointerMoveRef = useRef(null);

  onPointerMoveRef.current = (event) => {
    coords.current = { x: event.clientX, y: event.clientY };
    if (!raf.current) raf.current = requestAnimationFrame(renderRef.current);

    const rawTarget = event.target;
    const target =
      rawTarget instanceof Element ? rawTarget : rawTarget?.parentElement;
    const inVita =
      target && typeof target.closest === "function" && target.closest(".vita");

    let isClickable = false;
    if (inVita) {
      // In Vita, ONLY elements inside an actual link tag (<a>) vanish the cursor
      isClickable = Boolean(target.closest("a"));
    } else if (target && typeof target.closest === "function") {
      isClickable = Boolean(target.closest(CLICKABLE));
    }

    if (cursorRef.current) {
      cursorRef.current.classList.toggle("is-mixing", isClickable);
    }
  };

  const renderRef = useRef(() => {
    const { x, y } = coords.current;
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
    raf.current = 0;
  });

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

    const handlePointerMove = (event) => {
      onPointerMoveRef.current?.(event);
    };

    const onLeave = () => {
      cursor.classList.add("is-mixing");
    };

    const onEnter = () => {
      cursor.classList.remove("is-mixing");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      root.classList.remove("has-custom-cursor");
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={cursorRef} className="cursor is-mixing" aria-hidden="true" />;
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload();
  });
}
