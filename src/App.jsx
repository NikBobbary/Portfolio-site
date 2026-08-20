import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import About from "./components/About.jsx";
import ActionButton from "./components/ActionButton.jsx";
import AppBar from "./components/AppBar.jsx";
import Boot from "./components/Boot.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Cursor from "./components/Cursor.jsx";
import LegalModal from "./components/LegalModal.jsx";
import Shimeji from "./components/Shimeji.jsx";
import SideNav from "./components/SideNav.jsx";
import WorkCaption from "./components/WorkCaption.jsx";
import WorkFrame from "./components/WorkFrame.jsx";
import { LEGAL } from "./data/legal.js";
import { CONTACT, SOCIAL } from "./data/nav.js";

const WORK = [
  {
    src: "/Screens/dyocars-1.jpg",
    width: 8041,
    height: 5346,
  },
  {
    src: "/Screens/dyocars-2.jpg",
    width: 8041,
    height: 5882,
    tags: ["Marketplace", "Discovery"],
    note: "Listing detail with live inventory and saved search.",
  },
  { src: "/Screens/dyocars-3.jpg", width: 8041, height: 5346 },
  { src: "/Screens/dyocars-4.jpg", width: 8041, height: 7968 },
  { src: "/Screens/dyocars-5.jpg", width: 8041, height: 5346 },
  {
    src: "/Screens/Pairty-1.jpg",
    width: 12062,
    height: 6812,
    caption:
      "Pairty verified networking—identity gates, paid verification, and match flows that replaced low-trust discovery with credentialed professional connections.",
    chips: ["Onboarding", "Activation Flows", "Identity Systems"],
  },
  {
    src: "/Screens/Pairty-2.jpg",
    width: 12062,
    height: 7977,
    tags: ["Identity Systems"],
    note: "Verification gate before professional matching.",
  },
  { src: "/Screens/Pairty-3.jpg", width: 16034, height: 9730 },
  {
    src: "/Screens/frame-9.svg",
    width: 8041,
    height: 5159,
    caption:
      "Focusoft brand system—logo, type, and palette that unified an AI software company's identity across web and marketing.",
    chips: ["Brand Identity", "Visual Systems"],
  },
  {
    src: "/Screens/lessonpal-1.jpg",
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
  {
    src: "/Screens/lessonpal-2.jpg",
    width: 8041,
    height: 4806,
    tags: ["Role Systems", "Multi-Party"],
    note: "Who can post, see, and escalate in-thread.",
  },
  { src: "/Screens/lessonpal-3.jpg", width: 8041, height: 5159 },
  { src: "/Screens/lessonpal-4.jpg", width: 8041, height: 4806 },
  {
    src: "/Screens/lessonpal-5.jpg",
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
    src: "/Screens/lessonpal-6.jpg",
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
  { src: "/Screens/lessonpal-7.jpg", width: 8041, height: 5318 },
];

/** First frame is critical; next starts after boot so it doesn’t starve #1. */
const WARM_AFTER_BOOT = 2;
/** Boot waits on the first frame only — later giants load progressively. */
const CRITICAL_SRC = WORK[0].src;
const BOOT_TIMEOUT_MS = 7000;
/** Keep the counter on stage long enough to read, even on a warm cache. */
const MIN_BOOT_MS = 2000;
const BOOT_HOLD_MS = 640;
const BOOT_SLIDE_MS = 920;

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

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
  const [bootProgress, setBootProgress] = useState(0);
  const [intro, setIntro] = useState(false);
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  const [legalDoc, setLegalDoc] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const topNavOutRef = useRef(false);
  const contactInRef = useRef(false);
  const bootProgressRef = useRef(0);
  const closeLegal = useCallback(() => setLegalDoc(null), []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let alive = true;
    let finished = false;
    let holding = false;
    let imageReady = false;
    let minElapsed = false;
    let timeoutId;
    let minId;
    let tickId;
    let holdId;
    let raceId;

    const paintProgress = (value) => {
      bootProgressRef.current = value;
      setBootProgress(value);
    };

    const startHold = () => {
      if (!alive || holding) return;
      holding = true;
      paintProgress(1);
      setIntro(true);
      holdId = window.setTimeout(
        () => {
          if (alive) setBootDone(true);
        },
        reduceMotion ? 0 : BOOT_HOLD_MS
      );
    };

    const finish = () => {
      if (!alive || finished) return;
      finished = true;
      window.clearTimeout(timeoutId);
      window.clearTimeout(minId);
      window.clearInterval(tickId);

      if (reduceMotion) {
        startHold();
        return;
      }

      const from = bootProgressRef.current;
      const startedAt = performance.now();
      const race = (now) => {
        if (!alive || holding) return;
        const t = Math.min((now - startedAt) / 420, 1);
        const eased = 1 - (1 - t) ** 3;
        if (t < 1) {
          paintProgress(from + (1 - from) * eased);
          raceId = window.requestAnimationFrame(race);
          return;
        }
        paintProgress(1);
        startHold();
      };
      raceId = window.requestAnimationFrame(race);
    };

    const tryFinish = () => {
      if (imageReady && minElapsed) finish();
    };

    if (!reduceMotion) {
      tickId = window.setInterval(() => {
        paintProgress(Math.min(bootProgressRef.current + 0.007, 0.84));
      }, 16);
    }

    minId = window.setTimeout(() => {
      minElapsed = true;
      tryFinish();
    }, reduceMotion ? 0 : MIN_BOOT_MS);
    timeoutId = window.setTimeout(finish, BOOT_TIMEOUT_MS);
    preloadImage(CRITICAL_SRC).then(() => {
      imageReady = true;
      tryFinish();
    });

    return () => {
      alive = false;
      window.clearTimeout(timeoutId);
      window.clearTimeout(minId);
      window.clearTimeout(holdId);
      window.cancelAnimationFrame(raceId);
      window.clearInterval(tickId);
    };
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (!bootDone) {
      return () => {
        document.body.style.overflow = previous;
      };
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      document.body.style.overflow = previous;
      return;
    }

    const unlockId = window.setTimeout(() => {
      document.body.style.overflow = previous;
    }, BOOT_SLIDE_MS);

    return () => {
      window.clearTimeout(unlockId);
      document.body.style.overflow = previous;
    };
  }, [bootDone]);

  useEffect(() => {
    if (!bootDone) return;

    let frame = 0;
    const measure = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setScrollProgress(next);
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
      <Boot done={bootDone} progress={bootProgress} scroll={scrollProgress} />

      <Cursor />
      <Shimeji ready={bootDone} />
      <SideNav />
      <header id="home" className="hero">
        <AppBar ref={topNavRef} />
        <div className="hero__inner">
          <div className="hero__stage">
            <img
              className="hero__mark"
              src="/nikitha-avatar.jpg"
              alt=""
              width={48}
              height={48}
              draggable={false}
            />
            <h1 className="hero__name">Nikitha Bobbary</h1>
            <p className="hero__role">0→1 Product Designer</p>
            <div className="hero__copy">
              <p>
                I design for humans to connect with each other — to build
                communities that sustain.
              </p>
              <p>
                Currently taking products from first principle through the
                systems, brand, and craft that make them hold.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main id="snapshots">
        {WORK.map(
          (
            {
              src,
              width,
              height,
              caption,
              chips = [],
              tags = [],
              note,
              decisions = [],
            },
            index
          ) => {
            const hasMeta = Boolean(caption) || chips.length > 0;
            const hasFoot = Boolean(note) || tags.length > 0;

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
                <div className="work-shot">
                  <WorkFrame
                    src={src}
                    width={width}
                    height={height}
                    priority={
                      index === 0 || (bootDone && index < WARM_AFTER_BOOT)
                    }
                    decisions={decisions}
                  />
                  {hasFoot ? (
                    <div className="work-frame-meta">
                      {note ? (
                        <p className="work-frame-note">{note}</p>
                      ) : null}
                      {tags.length > 0 ? (
                        <ul className="work-frame-tags" aria-label="Image tags">
                          {tags.map((tag, tagIndex) => (
                            <li
                              key={`${src}-tag-${tagIndex}`}
                              className="work-frame-tag"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </div>
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
                  external={CONTACT.external}
                  tooltip={CONTACT.tooltip}
                  tooltipPlace="below"
                >
                  {CONTACT.label}
                </ActionButton>
                <div className="contact__social">
                  {SOCIAL.map(({ id, label, href, icon, tooltip, external }) => (
                    <ActionButton
                      key={id}
                      className="contact__icon"
                      href={href}
                      external={external}
                      tooltip={tooltip}
                      tooltipPlace="below"
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
