import { useEffect, useRef, useState } from "react";
import AppBar from "./components/AppBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Cursor from "./components/Cursor.jsx";
import WorkCaption from "./components/WorkCaption.jsx";

const EMPTY_CHIPS = ["", "", ""];

const WORK = [
  { src: "/Screens/frame.svg"},
  {
    src: "/Screens/frame-1.svg",
    caption:
      "Group support messaging for tutors, students, and Lessonpal—role-aware threads that replaced fragmented 1:1s and scaled multi-admin support ops."
  },
  { src: "/Screens/frame-2.svg"},
  { src: "/Screens/frame-3.svg"},
  {
    src: "/Screens/frame-4.svg",
    caption:
      "Rescheduling for students and tutors, status-aware flows with conflict checks and Command Center controls that cut missed-session friction and support load."
  },
  {
    src: "/Screens/frame-5.svg",
    caption:
      "Acquisition experience for finding trusted tutors and booking lessons.",
    chips: ["Landing Page", "Responsive"],
  },
  { src: "/Screens/frame-6.svg"},
];

const FRAME_SRCS = WORK.map((item) => item.src);

const FOCUS_CHIPS = [
  "0→1 Product",
  "Product Systems",
  "AI Craft",
  "UX Design",
  "Branding",
];

/** After quote + profile have the stage; then chrome + images join. */
const INTRO_MS = 1200;

export default function App() {
  const workRef = useRef(null);
  const topNavRef = useRef(null);
  const [intro, setIntro] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [revealed, setRevealed] = useState(() => new Set());
  const [bottomNavVisible, setBottomNavVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setIntro(true);
      setImagesReady(true);
      return;
    }

    const boot = window.requestAnimationFrame(() => setIntro(true));
    const unlockImages = window.setTimeout(() => setImagesReady(true), INTRO_MS);

    return () => {
      window.cancelAnimationFrame(boot);
      window.clearTimeout(unlockImages);
    };
  }, []);

  useEffect(() => {
    const topNav = topNavRef.current;
    if (!topNav || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setBottomNavVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(topNav);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!imagesReady) return;

    const root = workRef.current;
    if (!root) return;

    const frames = root.querySelectorAll("img");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setRevealed(new Set(FRAME_SRCS));
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
  }, [imagesReady]);

  return (
    <div className={intro ? "is-intro" : undefined}>
      <Cursor />
      <header className="hero">
        <AppBar ref={topNavRef} />
        <div className="hero__inner">
          <div className="hero__stage">
            <div className="hero__left">
              <h1 className="hero__quote">
                “I design for humans to{" "}
                <strong>connect with each other</strong> — to build{" "}
                <strong>communities that sustain</strong>”
              </h1>
              <div className="hero__profile">
                <img
                  className="hero__avatar"
                  src="/nikitha-avatar.jpg"
                  alt="Nikitha"
                  width={48}
                  height={48}
                  draggable={false}
                />
                <div className="hero__identity">
                  <p className="hero__name">Nikitha Bobbary</p>
                  <p className="hero__role">0→1 Product Designer</p>
                </div>
              </div>
            </div>

            <ul className="hero__chips" aria-label="Focus areas">
              {FOCUS_CHIPS.map((chip) => (
                <li key={chip} className="hero__chip">
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <main id="work" ref={workRef}>
        {WORK.map(({ src, caption, chips = [] }) => (
          <figure key={src} className="work-block">
            <div className="work-meta">
              <div className="work-meta__copy">
                {caption ? <WorkCaption text={caption} /> : null}
              </div>
              {chips.length > 0 ? (
                <ul className="work-chips" aria-label="Project tags">
                  {chips.map((chip, index) => (
                    <li
                      key={`${src}-chip-${index}`}
                      className={`work-chip${chip ? "" : " is-empty"}`}
                    >
                      {chip || "\u00A0"}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <img
              src={src}
              alt=""
              className={revealed.has(src) ? "is-visible" : undefined}
            />
          </figure>
        ))}
      </main>

      <BottomNav visible={bottomNavVisible} />
    </div>
  );
}
