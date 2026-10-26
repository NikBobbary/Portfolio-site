import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, JokerIcon, Tick01Icon } from "@hugeicons/core-free-icons";
import ActionButton from "../components/ActionButton.jsx";
import Cursor from "../components/Cursor.jsx";
import { CONTACT, SOCIAL } from "../data/nav.js";
import { WORK_CASE_STUDIES } from "../data/workCases.js";
import { applyNoIndexMeta, isWorkSubdomain, redirectToMain } from "../utils/domain.js";
import { useCopyEmail } from "../utils/useCopyEmail.js";
import LessonpalSections from "../components/LessonpalSections.jsx";
import DyocarSections from "../components/DyocarSections.jsx";
import PairtySections from "../components/PairtySections.jsx";
import BottomNav from "../components/BottomNav.jsx";

const ACCENT_MAP = {
  lessonpal: "amber",
  dyocar: "emerald",
  pairty: "indigo",
};

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { copied, copy } = useCopyEmail();
  const [atBottom, setAtBottom] = useState(false);
  const bottomSentinelRef = useRef(null);

  // Normalize slug: strip leading ~, slashes, or prefix
  const cleanSlug = (slug || "")
    .replace(/^[~/]+/, "")
    .replace(/^work\//, "")
    .replace(/^cases\//, "")
    .toLowerCase();

  const caseIndex = WORK_CASE_STUDIES.findIndex(
    (item) => item.id.toLowerCase() === cleanSlug || item.slug.toLowerCase() === cleanSlug
  );

  const caseStudy = caseIndex !== -1 ? WORK_CASE_STUDIES[caseIndex] : null;

  const workHref = "/";

  useEffect(() => {
    if (!caseStudy) {
      redirectToMain();
      return;
    }

    setAtBottom(false);

    // Ensure subdomain noindex protection is active
    applyNoIndexMeta(true);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    if (caseStudy?.title) {
      document.title = `${caseStudy.title} — Nikitha Bobbary`;
    }
  }, [caseStudy]);

  useEffect(() => {
    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    let isIntersecting = false;
    let currentlyAtBottom = false;

    const checkScrollPosition = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const distanceToBottom = docHeight - (scrollY + viewportHeight);

      // Trigger bottom state when within 80px of bottom or sentinel is intersecting
      if (!currentlyAtBottom && (distanceToBottom <= 80 || isIntersecting)) {
        currentlyAtBottom = true;
        setAtBottom(true);
      } else if (currentlyAtBottom && distanceToBottom > 140 && !isIntersecting) {
        currentlyAtBottom = false;
        setAtBottom(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        checkScrollPosition();
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);

    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition);

    if (window.lenis) {
      window.lenis.on("scroll", checkScrollPosition);
    }

    checkScrollPosition();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
      if (window.lenis) {
        window.lenis.off("scroll", checkScrollPosition);
      }
    };
  }, []);

  if (!caseStudy) {
    return null;
  }

  return (
    <div className="case-detail-page">
      <Cursor />

      <header className={`case-detail-nav${atBottom ? " is-hidden" : ""}`}>
        <div className="case-detail-nav__inner">
          <div className="case-detail-nav__left">
            <ActionButton
              className="appbar__icon"
              href={workHref}
              onClick={(e) => {
                e.preventDefault();
                navigate(workHref);
              }}
              tooltip="Home"
              tooltipPlace="below"
              aria-label="Home"
            >
              <HugeiconsIcon icon={JokerIcon} size={18} strokeWidth={1} />
            </ActionButton>
            <div className="case-detail-nav__social">
              {SOCIAL.map(({ id, label, href, icon, tooltip, external }) => (
                <ActionButton
                  key={id}
                  className="appbar__icon"
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

          <ActionButton
            className={`case-detail-nav__cta${copied ? " is-copied" : ""}`}
            onClick={copy}
            aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
          >
            <HugeiconsIcon
              className="case-detail-nav__cta-icon"
              icon={copied ? Tick01Icon : Copy01Icon}
              size={16}
              strokeWidth={1.2}
            />
            {copied ? "Copied!" : CONTACT.label}
          </ActionButton>
        </div>
      </header>

      <section
        className={`case-hero${
          ["lessonpal", "dyocar"].includes(caseStudy.id) && caseStudy.image
            ? " case-hero--has-media"
            : ""
        }`}
      >
        <h1 className="case-hero__title cs-title">
          {caseStudy.heroTitle || caseStudy.title}
        </h1>
        <div className="case-hero__details cs-code2">
          {(caseStudy.details || [
            caseStudy.role,
            caseStudy.year,
            caseStudy.company || `${caseStudy.title}: ${caseStudy.categories?.[0] || ""}`,
            caseStudy.tagline,
          ].filter(Boolean)).map((detail, idx) => (
            <div key={idx} className="case-hero__detail-item">
              {detail}
            </div>
          ))}
        </div>

        {["lessonpal", "dyocar"].includes(caseStudy.id) && caseStudy.image && (
          <div className="case-hero__media">
            <div
              className={`screen-mockup-canvas case-hero__canvas case-hero__canvas--${
                ACCENT_MAP[caseStudy.id] || "emerald"
              }`}
            >
              <img
                src={caseStudy.image}
                alt={caseStudy.alt || `${caseStudy.title} hero mockup`}
                width={caseStudy.width}
                height={caseStudy.height}
                className="screen-mockup-image case-hero__img"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        )}
      </section>

      {caseStudy.id === "lessonpal" && <LessonpalSections />}
      {caseStudy.id === "dyocar" && <DyocarSections />}
      {caseStudy.id === "pairty" && <PairtySections />}

      <div
        ref={bottomSentinelRef}
        className="case-detail-bottom-sentinel"
        aria-hidden="true"
      />

      <BottomNav
        visible={atBottom}
        socialsOnly={true}
        showHome={true}
        homeHref={workHref}
      />
    </div>
  );
}
