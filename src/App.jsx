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
import Vita from "./components/Vita.jsx";
import WorkFrame from "./components/WorkFrame.jsx";
import WorkHeader from "./components/WorkHeader.jsx";
import WorkGrid from "./components/WorkGrid.jsx";
import { applyNoIndexMeta, isWorkDomain } from "./utils/domain.js";
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

export default function App({ isWorkView = false }) {
  const [isWork] = useState(() => isWorkView || isWorkDomain());

  useEffect(() => {
    if (isWork) {
      applyNoIndexMeta(true);
    }
  }, [isWork]);

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

  const aboutSection = (
    <section
      id="about"
      className="like like--separator"
      aria-labelledby="like-heading"
    >
      <h2 id="like-heading" className="like__title">
        working with me
      </h2>
      <div className="like__portrait-wrap">
        <img
          src="/profile.jpg"
          alt="Nikitha Bobbary"
          className="like__portrait"
          loading="eager"
        />
      </div>
      <div className="like__copy">
        <p>
          I’m a generalist and a 0→1 designer. Most of my work has been with engineering-led teams, usually when the product is complicated, early, or still being figured out.
        </p>
        <p>
          I like that stage. There’s usually no neat brief to work from, so I tend to get involved wherever the problem takes me, figuring out what’s worth solving, talking through it with founders and engineers, shaping the product, and getting into the details of how it actually works.
        </p>
        <p>
          A lot of my curiosity lately has been around AI. Not so much the technology itself, but what happens when you try to turn it into a useful product. There’s a lot of room for genuinely new interactions, and a lot of room for things that are just features with AI attached.
        </p>
        <p>
          I like moving fast, but I care a lot about craft. I can spend an unreasonable amount of time on something small if I think it matters. And I rarely stay inside the boundaries of a design task for very long. While working on one problem, I’ll usually find a few more worth fixing.
        </p>
        <p>
          That’s probably the kind of designer I am: interested in the whole thing, not just the part that happens to have my name on it.
        </p>
      </div>
    </section>
  );

  const snapshotsSection = (
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
  );

  return (
    <div className={intro ? "is-intro" : undefined}>
      <Boot done={bootDone} progress={bootProgress} />

      <Cursor />
      <Shimeji ready={bootDone} />
      <header id="home" className="hero">
        <AppBar ref={topNavRef} />
        <div className="hero__unit">
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
              Self-taught in design, trained as an engineer, and endlessly curious about people, art, and how things work.
              </p>
            </div>
            {localeOpen ? <LocaleCard /> : null}
          </div>
          <Vita />
        </div>
      </header>

      {isWork ? (
        <>
          <WorkGrid />
          {aboutSection}
          {snapshotsSection}
        </>
      ) : (
        <>
          {snapshotsSection}
          {aboutSection}
        </>
      )}

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

      <BottomNav visible={bottomNavVisible} isWork={isWork} />
    </div>
  );
}
