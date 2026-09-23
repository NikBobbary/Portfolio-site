import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ActionButton from "./components/ActionButton.jsx";
import AppBar from "./components/AppBar.jsx";
import Boot from "./components/Boot.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Cursor from "./components/Cursor.jsx";
import HeroName from "./components/HeroName.jsx";
import HeroZeroOne from "./components/HeroZeroOne.jsx";
import LocaleCard from "./components/LocaleCard.jsx";
import FooterName from "./components/FooterName.jsx";
import Shimeji from "./components/Shimeji.jsx";
import WorkFrame from "./components/WorkFrame.jsx";
import WorkHeader from "./components/WorkHeader.jsx";
import { CONTACT, SOCIAL } from "./data/nav.js";

const WORK = [
  {
    id: "dyocar",
    name: "Dyocar",
    tagline: "Hyper-personalized car rental",
    credit: "Founding Designer",
    shots: [
      {
        src: "/Screens/2400/dyocar-1.jpg",
        width: 8041,
        height: 5882,
        tags: ["Marketplace", "Discovery"],
        note: "Listing detail with live inventory and saved search.",
      },
      {
        src: "/Screens/2400/dyocar-2.jpg",
        width: 8041,
        height: 5346,
      },
      { src: "/Screens/2400/dyocar-3.jpg", width: 8041, height: 5346 },
      { src: "/Screens/2400/dyocar-4.jpg", width: 8041, height: 7968 },
      { src: "/Screens/2400/dyocar-5.jpg", width: 8041, height: 5346 },
    ],
  },
  {
    id: "pairty",
    name: "Pairty",
    tagline: "Human venture capital network",
    credit: "Product Designer, partner with Focusoft HQ",
    shots: [
      {
        src: "/Screens/2400/Pairty-1.jpg",
        width: 12062,
        height: 6812,
      },
      {
        src: "/Screens/2400/Pairty-2.jpg",
        width: 12062,
        height: 7977,
        tags: ["Identity Systems"],
        note: "Verification gate before professional matching.",
      },
      { src: "/Screens/2400/Pairty-3.jpg", width: 2400, height: 1432 },
    ],
  },
  {
    id: "focusoft",
    name: "Focusoft",
    tagline: "AI & digital innovation studio",
    credit: "Founding Designer",
    shots: [
      {
        src: "/Screens/2400/focusoft.jpg",
        width: 2400,
        height: 1539,
      },
      {
        src: "/Screens/2400/focusoft-2.jpg",
        width: 2400,
        height: 1479,
      },
    ],
  },
  {
    id: "lessonpal",
    name: "Lessonpal",
    tagline: "1-on-1 tutoring marketplace",
    credit: "Product Designer",
    shots: [
      { src: "/Screens/2400/lessonpal-1.jpg", width: 8041, height: 8862 },
      { src: "/Screens/2400/lessonpal-2.jpg", width: 8041, height: 5318 },
      { src: "/Screens/2400/lessonpal-3.jpg", width: 8041, height: 4806 },
      {
        src: "/Screens/2400/lessonpal-4.jpg",
        width: 8041,
        height: 4806,
        tags: ["Role Systems", "Multi-Party"],
        note: "Who can post, see, and escalate in-thread.",
      },
      { src: "/Screens/2400/lessonpal-5.jpg", width: 8041, height: 5159 },
      { src: "/Screens/2400/lessonpal-6.jpg", width: 2400, height: 1587 },
      { src: "/Screens/2400/lessonpal-7.jpg", width: 8041, height: 4806 },
    ],
  },
];

/** First two frames: #1 during boot, #2 once #1 is in so it doesn’t starve. */
const WARM_AFTER_BOOT = 2;
const BOOT_TIMEOUT_MS = 25000;
/** Keep the counter on stage long enough to read, even on a warm cache. */
const MIN_BOOT_MS = 2000;
const BOOT_HOLD_MS = 640;
const BOOT_SLIDE_MS = 920;

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
  const [criticalReady, setCriticalReady] = useState(false);
  const [intro, setIntro] = useState(false);
  const criticalReadyRef = useRef(false);
  const onCriticalRef = useRef(() => {});
  const markCriticalReady = useCallback(() => {
    if (criticalReadyRef.current) return;
    criticalReadyRef.current = true;
    setCriticalReady(true);
    onCriticalRef.current();
  }, []);
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  const [localeHover, setLocaleHover] = useState(false);
  const [localePinned, setLocalePinned] = useState(false);
  const localeOpen = localeHover || localePinned;
  const topNavOutRef = useRef(false);
  const contactInRef = useRef(false);
  const bootProgressRef = useRef(0);
  const pinLocale = useCallback(() => {
    setLocalePinned((pinned) => !pinned);
  }, []);

  useEffect(() => {
    if (!localePinned) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setLocalePinned(false);
    };
    const onPointerDown = (event) => {
      if (event.target.closest(".hero__place, .locale-card")) return;
      setLocalePinned(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [localePinned]);

  useEffect(() => {
    const root = document.documentElement;
    const lock = () => {
      root.style.setProperty("--hero-min", `${window.innerHeight}px`);
    };

    lock();

    const onOrientation = () => {
      window.setTimeout(lock, 400);
    };

    window.addEventListener("orientationchange", onOrientation);
    return () => {
      window.removeEventListener("orientationchange", onOrientation);
      root.style.removeProperty("--hero-min");
    };
  }, []);

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
    onCriticalRef.current = () => {
      imageReady = true;
      tryFinish();
    };
    if (criticalReadyRef.current) onCriticalRef.current();

    return () => {
      alive = false;
      onCriticalRef.current = () => {};
      window.clearTimeout(timeoutId);
      window.clearTimeout(minId);
      window.clearTimeout(holdId);
      window.cancelAnimationFrame(raceId);
      window.clearInterval(tickId);
    };
  }, [markCriticalReady]);

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
      <Boot done={bootDone} progress={bootProgress} />

      <Cursor />
      <Shimeji ready={bootDone} />
      <header id="home" className="hero">
        <AppBar ref={topNavRef} />
        <div className="hero__inner">
          <div className="hero__stage">
            <h1 className="hero__name">
              <span className="hero__lead">
                Hey! I&apos;m <HeroName />
              </span>
              a <HeroZeroOne /> from{" "}
              <button
                type="button"
                className={`hero__place${localeOpen ? " is-open" : ""}`}
                aria-expanded={localeOpen}
                aria-pressed={localePinned}
                aria-controls="locale-card"
                onPointerEnter={() => setLocaleHover(true)}
                onPointerLeave={() => setLocaleHover(false)}
                onClick={pinLocale}
              >
                India
                <span className="hero__flag" aria-hidden="true">
                  <span className="hero__flag-glyph">🇮🇳</span>
                </span>
              </button>
              .
            </h1>
            <p className="hero__dek">
              I&apos;ve been designing global products for 5 years — currently
              building and designing at Nesaasity.
            </p>
          </div>
          {localeOpen ? <LocaleCard /> : null}
        </div>
      </header>

      <main id="snapshots">
        {WORK.map((group, groupIndex) => {
          const shotOffset = WORK.slice(0, groupIndex).reduce(
            (count, item) => count + item.shots.length,
            0
          );

          return (
            <section
              key={group.id}
              id={group.id}
              className="work-group"
              aria-label={group.name}
            >
              <WorkHeader
                name={group.name}
                tagline={group.tagline}
                credit={group.credit}
                logo={group.logo}
              />
              {group.shots.map(
                (
                  { src, width, height, tags = [], note },
                  shotIndex
                ) => {
                  const index = shotOffset + shotIndex;
                  const hasFoot = Boolean(note) || tags.length > 0;

                  return (
                    <div key={src} className="work-shot">
                      <WorkFrame
                        src={src}
                        width={width}
                        height={height}
                        priority={
                          index === 0 ||
                          (criticalReady && index < WARM_AFTER_BOOT)
                        }
                        allowLazy={bootDone}
                        onReady={index === 0 ? markCriticalReady : undefined}
                      />
                      {hasFoot ? (
                        <div className="work-frame-meta">
                          {note ? (
                            <p className="work-frame-note">{note}</p>
                          ) : null}
                          {tags.length > 0 ? (
                            <ul
                              className="work-frame-tags"
                              aria-label="Image tags"
                            >
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
                  );
                }
              )}
            </section>
          );
        })}
      </main>

      <section
        id="about"
        className="like"
        aria-labelledby="like-heading"
      >
        <h2 id="like-heading" className="like__title">
          working with me
        </h2>
        <div className="like__copy">
          <p>
          I’m a generalist and a 0→1 designer. I’ve mostly worked with engineering-led teams, especially where the product is complex or the problem isn’t clearly defined yet.
          </p>
          <p>
            I enjoy working closely with founders and teams, helping connect the dots between what we’re trying to solve and what we actually build. A lot of my work has also been around AI-led products, figuring out how these new tools can become useful products rather than just shiny features.
          </p>
          <p>
          I work best in teams that care about understanding the problem properly, but also want to move fast and learn by doing. I like dynamic teams where people and roles overlap — it means I get to see more of the problem and contribute beyond just the design file.
          </p>
          <p>
          And usually, while working on one problem, I end up finding a few more things worth fixing. Not because I want to expand the scope unnecessarily, but because solving one thing often reveals something else that matters.
          </p>
        </div>
      </section>

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
          <FooterName />
        </div>
        <div className="contact__legal">
          <p className="contact__copyright">
            © {new Date().getFullYear()} Nikitha Bobbary
          </p>
        </div>
      </section>

      <BottomNav visible={bottomNavVisible} />
    </div>
  );
}
