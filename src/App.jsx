import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import About from "./components/About.jsx";
import ActionButton from "./components/ActionButton.jsx";
import AppBar from "./components/AppBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Cursor from "./components/Cursor.jsx";
import LegalModal from "./components/LegalModal.jsx";
import SideNav from "./components/SideNav.jsx";
import WorkCaption from "./components/WorkCaption.jsx";
import WorkFrame from "./components/WorkFrame.jsx";
import { LEGAL } from "./data/legal.js";
import { CONTACT, SOCIAL } from "./data/nav.js";

const WORK = [
  {
    src: "/Screens/dyocars-1.jpg",
    width: 8041,
    height: 4541,
  },
  { src: "/Screens/dyocars-2.svg", width: 8041, height: 5882 },
  { src: "/Screens/dyocars-3.jpg", width: 8041, height: 4541 },
  {
    src: "/Screens/Pairty-1.jpg",
    width: 12062,
    height: 6812,
    caption:
      "Pairty verified networking—identity gates, paid verification, and match flows that replaced low-trust discovery with credentialed professional connections.",
    chips: ["Onboarding", "Activation Flows", "Identity Systems"],
  },
  { src: "/Screens/Pairty-2.jpg", width: 12062, height: 7977 },
  {
    src: "/Screens/frame-9.svg",
    width: 8041,
    height: 5159,
    caption:
      "Focusoft brand system—logo, type, and palette that unified an AI software company's identity across web and marketing.",
    chips: ["Brand Identity", "Visual Systems"],
  },
  {
    src: "/Screens/frame.svg",
    width: 8041,
    height: 4806,
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
  { src: "/Screens/frame-1.svg", width: 8041, height: 4806 },
  { src: "/Screens/frame-2.svg", width: 8041, height: 5159 },
  {
    src: "/Screens/frame-4.svg",
    width: 8041,
    height: 4806,
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
    width: 8041,
    height: 8862,
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
  { src: "/Screens/frame-6.svg", width: 8041, height: 5318 },
];

/** First frame is critical; next starts after boot so it doesn’t starve #1. */
const WARM_AFTER_BOOT = 2;
/** Boot waits on the first frame only — later giants load progressively. */
const CRITICAL_SRC = WORK[0].src;
const BOOT_TIMEOUT_MS = 7000;

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

const FOCUS_CHIPS = [
  "0→1 Product",
  "Product Systems",
  "AI Craft",
  "UX Design",
  "Branding",
];

/** Domains aligned to shipped work — and commercially strong. */
const DOMAIN_CHIPS = [
  "AI SaaS",
  "B2B Platforms",
  "Marketplaces",
  "EdTech",
  "Identity Systems",
];

export default function App() {
  const topNavRef = useRef(null);
  const [bootDone, setBootDone] = useState(false);
  const [bootProgress, setBootProgress] = useState(0.1);
  const [intro, setIntro] = useState(false);
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  const [legalDoc, setLegalDoc] = useState(null);
  const topNavOutRef = useRef(false);
  const contactInRef = useRef(false);
  const closeLegal = useCallback(() => setLegalDoc(null), []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let alive = true;
    let finished = false;
    let timeoutId;
    let tickId;
    let dismissId;

    const finish = () => {
      if (!alive || finished) return;
      finished = true;
      window.clearTimeout(timeoutId);
      window.clearInterval(tickId);
      setBootProgress(1);
      dismissId = window.setTimeout(
        () => {
          if (alive) setBootDone(true);
        },
        reduceMotion ? 0 : 220
      );
    };

    if (!reduceMotion) {
      tickId = window.setInterval(() => {
        setBootProgress((value) => Math.min(value + 0.05, 0.78));
      }, 280);
    }

    timeoutId = window.setTimeout(finish, BOOT_TIMEOUT_MS);
    preloadImage(CRITICAL_SRC).then(finish);

    return () => {
      alive = false;
      window.clearTimeout(timeoutId);
      window.clearTimeout(dismissId);
      window.clearInterval(tickId);
    };
  }, []);

  useEffect(() => {
    if (bootDone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [bootDone]);

  useEffect(() => {
    if (!bootDone) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setIntro(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => setIntro(true));
    return () => window.cancelAnimationFrame(frame);
  }, [bootDone]);

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

  return (
    <div className={intro ? "is-intro" : undefined}>
      <div
        className={`boot${bootDone ? " is-done" : ""}`}
        aria-hidden={bootDone}
        aria-busy={!bootDone}
        role="status"
      >
        <p className="boot__name">Nikitha Bobbary</p>
        <div className="boot__track" aria-hidden="true">
          <span
            className="boot__fill"
            style={{ transform: `scaleX(${bootProgress})` }}
          />
        </div>
        <p className="boot__label">Preparing work</p>
      </div>

      <Cursor />
      <SideNav />
      <header id="home" className="hero">
        <AppBar ref={topNavRef} />
        <div className="hero__inner">
          <div className="hero__stage">
            <h1 className="hero__quote">
              “I design for humans to{" "}
              <strong>connect with each other</strong> — to build{" "}
              <strong>communities that sustain</strong>”
            </h1>
            <ul className="hero__chips" aria-label="Focus areas">
              {FOCUS_CHIPS.map((chip) => (
                <li key={chip} className="hero__chip">
                  {chip}
                </li>
              ))}
            </ul>
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
        </div>
      </header>

      <main id="work">
        {WORK.map(
          ({ src, width, height, caption, chips = [], decisions = [] }, index) => {
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
                        {chips.map((chip, chipIndex) => (
                          <li
                            key={`${src}-chip-${chipIndex}`}
                            className="work-chip"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
                <WorkFrame
                  src={src}
                  width={width}
                  height={height}
                  priority={
                    index === 0 || (bootDone && index < WARM_AFTER_BOOT)
                  }
                  decisions={decisions}
                />
              </Fragment>
            );
          }
        )}
      </main>

      <About />

      <section id="contact" className="contact" aria-labelledby="contact-heading">
        <div className="contact__box">
          <div className="contact__stage">
            <div className="contact__inner">
              <h2 id="contact-heading" className="contact__title">
                Let’s build something people can rely on
              </h2>
              <div className="contact__actions">
                <ActionButton
                  className="hero__cta hero__cta--primary"
                  href={CONTACT.href}
                  tooltip={CONTACT.tooltip}
                >
                  {CONTACT.label}
                </ActionButton>
                <div className="contact__social">
                  {SOCIAL.map(({ id, label, href, icon, tooltip }) => (
                    <ActionButton
                      key={id}
                      className="contact__icon"
                      href={href}
                      external
                      tooltip={tooltip}
                      aria-label={label}
                    >
                      <HugeiconsIcon icon={icon} size={18} strokeWidth={1} />
                    </ActionButton>
                  ))}
                </div>
              </div>
            </div>
            <ul className="contact__chips" aria-label="Domains of interest">
              {DOMAIN_CHIPS.map((chip) => (
                <li key={chip} className="contact__chip">
                  {chip}
                </li>
              ))}
            </ul>
          </div>
          <img
            className="contact__brand"
            src="/footer-name.svg"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </div>
        <div className="contact__legal">
          <p className="contact__copyright">
            © {new Date().getFullYear()} Nikitha Bobbary
          </p>
          <nav className="contact__policies" aria-label="Legal">
            <ActionButton
              className="contact__policy"
              onClick={() => setLegalDoc(LEGAL.privacy)}
            >
              Privacy Policy
            </ActionButton>
            <ActionButton
              className="contact__policy"
              onClick={() => setLegalDoc(LEGAL.terms)}
            >
              Terms & Conditions
            </ActionButton>
          </nav>
        </div>
      </section>

      <LegalModal doc={legalDoc} onClose={closeLegal} />
      <BottomNav visible={bottomNavVisible} />
    </div>
  );
}
