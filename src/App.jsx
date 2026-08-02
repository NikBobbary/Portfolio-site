import { useEffect, useRef, useState } from "react";
import AppBar from "./components/AppBar.jsx";
import Cursor from "./components/Cursor.jsx";

const FRAMES = [
  "/Screens/frame.svg",
  "/Screens/frame-1.svg",
  "/Screens/frame-2.svg",
  "/Screens/frame-3.svg",
  "/Screens/frame-4.svg",
  "/Screens/frame-5.svg",
  "/Screens/frame-6.svg",
];

export default function App() {
  const workRef = useRef(null);
  const [revealed, setRevealed] = useState(() => new Set());

  useEffect(() => {
    const root = workRef.current;
    if (!root) return;

    const frames = root.querySelectorAll("img");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setRevealed(new Set(FRAMES));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const src = entry.target.getAttribute("src");
          if (!src) return;
          setRevealed((prev) => {
            if (prev.has(src)) return prev;
            const next = new Set(prev);
            next.add(src);
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    frames.forEach((frame) => observer.observe(frame));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Cursor />
      <header className="hero">
        <AppBar />
        <div className="hero__inner">
          <div className="hero__copy">
            <h1 className="hero__name">Nikitha</h1>
            <p className="hero__lede">
              I design for humans to connect with each other — to build
              communities that sustain.
            </p>
          </div>
          <div className="hero__actions">
            <a className="hero__cta" href="#work">
              Selected work
            </a>
            <a className="hero__aside" href="mailto:nikbobbary@gmail.com">
              0→1 Product Designer
              <span aria-hidden="true"> →</span>
            </a>
          </div>
        </div>
      </header>

      <main id="work" ref={workRef}>
        {FRAMES.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            className={revealed.has(src) ? "is-visible" : undefined}
          />
        ))}
      </main>
    </>
  );
}
