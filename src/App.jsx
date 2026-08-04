import { Fragment, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import AppBar from "./components/AppBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Cursor from "./components/Cursor.jsx";
import SideNav from "./components/SideNav.jsx";
import WorkCaption from "./components/WorkCaption.jsx";
import WorkFrame from "./components/WorkFrame.jsx";
import { CONTACT, SOCIAL } from "./data/nav.js";

const WORK = [
  { src: "/Screens/frame-7.svg",
    caption:
    "Pairty verified networking—identity gates, paid verification, and match flows that replaced low-trust discovery with credentialed professional connections.",
    chips: ["Onboarding", "Activation Flows", "Identity Systems"],
   },
  { src: "/Screens/frame-8.svg" },
  { src: "/Screens/frame-9.svg",
    caption:
    "Focusoft brand system—logo, type, and palette that unified an AI software company's identity across web and marketing.",
    chips: ["Brand Identity", "Visual Systems"],
   },
  {
    src: "/Screens/frame.svg",
    caption:
      "Role-aware group support messaging for tutors, students, and support team that replaced fragmented 1:1s and scaled multi-admin support ops.",
    chips: ["Admin Workflows", "Role Systems", "Multi-Party"],
    decisions: [
      {
        x: "18%",
        y: "28%",
        text: "Role chips gate who can post, see, and escalate in-thread.",
      },
      {
        x: "62%",
        y: "54%",
        text: "Threaded context replaces fragmented 1:1 support handoffs.",
      },
    ],
  },
  { src: "/Screens/frame-1.svg" },
  { src: "/Screens/frame-2.svg" },
  {
    src: "/Screens/frame-4.svg",
    caption:
      "Rescheduling for students and tutors, status-aware flows with conflict checks that cut missed-session friction.",
    chips: ["Conflict Resolution", "Edge Cases"],
    decisions: [
      {
        x: "30%",
        y: "36%",
        text: "Status drives which reschedule actions are available.",
      },
      {
        x: "70%",
        y: "58%",
        text: "Conflict checks block double-books before confirm.",
      },
    ],
  },
  {
    src: "/Screens/frame-5.svg",
    caption:
      "Marketplace landing for tutor discovery; quick subject browsing, reviews, and Good Fit Guarantee optimized for conversion.",
    chips: ["Landing Page", "Information Architecture"],
    decisions: [
      {
        x: "24%",
        y: "32%",
        text: "Subject discovery sits above the fold to start intent fast.",
      },
      {
        x: "66%",
        y: "62%",
        text: "Reviews + Good Fit Guarantee reduce first-lesson risk.",
      },
    ],
  },
  { src: "/Screens/frame-6.svg" },
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
  const topNavOutRef = useRef(false);
  const contactInRef = useRef(false);

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
    const contact = document.getElementById("contact");
    if (!topNav || !("IntersectionObserver" in window)) return;

    const syncBottomNav = () => {
      setBottomNavVisible(topNavOutRef.current && !contactInRef.current);
    };

    const topObserver = new IntersectionObserver(
      ([entry]) => {
        topNavOutRef.current = !entry.isIntersecting;
        syncBottomNav();
      },
      { threshold: 0 }
    );

    topObserver.observe(topNav);

    let contactObserver;
    if (contact) {
      contactObserver = new IntersectionObserver(
        ([entry]) => {
          contactInRef.current = entry.isIntersecting;
          syncBottomNav();
        },
        { threshold: 0.2 }
      );
      contactObserver.observe(contact);
    }

    return () => {
      topObserver.disconnect();
      contactObserver?.disconnect();
    };
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
      <SideNav />
      <header id="home" className="hero">
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

          <div className="hero__ctas">
            <a className="hero__cta hero__cta--primary" href="#work">
              Explore work
            </a>
            <a className="hero__cta hero__cta--secondary" href="#contact">
              Contact me
            </a>
          </div>
        </div>
      </header>

      <main id="work" ref={workRef}>
        {WORK.map(({ src, caption, chips = [], decisions = [] }) => {
          const hasMeta = Boolean(caption) || chips.length > 0;

          return (
            <Fragment key={src}>
              {hasMeta ? (
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
              ) : null}
              <WorkFrame
                src={src}
                revealed={revealed.has(src)}
                decisions={decisions}
              />
            </Fragment>
          );
        })}
      </main>

      <section id="about" className="about" aria-labelledby="about-heading">
        <div className="about__inner">
          <h2 id="about-heading" className="about__title">
            Designing the systems people use to find each other
          </h2>
          <p className="about__body">
            I work on 0→1 products where trust, identity, and community shape the
            experience — from verification flows and role systems to brand that
            holds the whole thing together.
          </p>
        </div>
      </section>

      <section id="contact" className="contact" aria-labelledby="contact-heading">
        <div className="contact__inner">
          <h2 id="contact-heading" className="contact__title">
            Let’s build something people can rely on
          </h2>
          <div className="contact__actions">
            <a className="hero__cta hero__cta--primary" href={CONTACT.href}>
              {CONTACT.label}
            </a>
            <div className="contact__social">
              {SOCIAL.map(({ id, label, href, icon }) => (
                <a
                  key={id}
                  className="contact__icon"
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                >
                  <HugeiconsIcon icon={icon} size={18} strokeWidth={1} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BottomNav visible={bottomNavVisible} />
    </div>
  );
}
