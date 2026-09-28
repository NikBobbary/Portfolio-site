import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, JokerIcon } from "@hugeicons/core-free-icons";
import ActionButton from "../components/ActionButton.jsx";
import Cursor from "../components/Cursor.jsx";
import { CONTACT, SOCIAL } from "../data/nav.js";
import { WORK_CASE_STUDIES } from "../data/workCases.js";
import { applyNoIndexMeta, isWorkSubdomain, redirectToMain } from "../utils/domain.js";
import LessonpalSections from "../components/LessonpalSections.jsx";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

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

    // Ensure subdomain noindex protection is active
    applyNoIndexMeta(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (caseStudy?.title) {
      document.title = `${caseStudy.title} — Nikitha Bobbary`;
    }
  }, [caseStudy]);

  if (!caseStudy) {
    return null;
  }

  return (
    <div className="case-detail-page">
      <Cursor />

      <header className="case-detail-nav">
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
            className="case-detail-nav__cta"
            href={CONTACT.href}
            external={CONTACT.external}
          >
            <HugeiconsIcon
              className="case-detail-nav__cta-icon"
              icon={Calendar03Icon}
              size={16}
              strokeWidth={1.2}
            />
            {CONTACT.label}
          </ActionButton>
        </div>
      </header>

      <section className="case-hero">
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
      </section>

      {caseStudy.id === "lessonpal" && <LessonpalSections />}
    </div>
  );
}
