import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "../data/nav.js";

const REVEAL_MS = 1000;
const HOT_ZONE = 0.2;
/** Viewport line used to decide the active section. */
const SPY_LINE = 0.32;

function getActiveSection() {
  const line = window.innerHeight * SPY_LINE;
  let current = SECTIONS[0].id;

  for (const { id } of SECTIONS) {
    const node = document.getElementById(id);
    if (!node) continue;
    if (node.getBoundingClientRect().top <= line) current = id;
  }

  return current;
}

export default function SideNav() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [revealed, setRevealed] = useState(false);
  const [hot, setHot] = useState(false);
  const hideTimer = useRef(null);
  const activeRef = useRef(SECTIONS[0].id);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const onMove = (event) => {
      setHot(event.clientX <= window.innerWidth * HOT_ZONE);
    };
    const onLeave = () => setHot(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    scrollYRef.current = window.scrollY;

    const reveal = () => {
      setRevealed(true);
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        setRevealed(false);
      }, REVEAL_MS);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const scrollingDown = y > scrollYRef.current;
      scrollYRef.current = y;

      const next = getActiveSection();
      if (next === activeRef.current) return;

      activeRef.current = next;
      setActive(next);

      // Only flash on the way down, and never for Home.
      if (scrollingDown && next !== "home") reveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  const open = revealed || hot;

  return (
    <nav
      className={`side-nav${open ? " is-open" : ""}`}
      aria-label="Sections"
      aria-hidden={!open}
    >
      <div className="side-nav__pill">
        <ul className="side-nav__list">
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                className={`side-nav__link${active === id ? " is-active" : ""}`}
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                tabIndex={open ? 0 : -1}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
