import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Cursor from "../components/Cursor.jsx";
import { WORK_CASE_STUDIES } from "../data/workCases.js";
import { applyNoIndexMeta, isWorkDomain } from "../utils/domain.js";

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

  const caseStudy = caseIndex !== -1 ? WORK_CASE_STUDIES[caseIndex] : WORK_CASE_STUDIES[0];
  const nextCase = WORK_CASE_STUDIES[(caseIndex + 1) % WORK_CASE_STUDIES.length];

  const isWork = isWorkDomain();
  const backHref = isWork ? "/#cases" : "/work#cases";

  useEffect(() => {
    // Ensure subdomain noindex protection is active
    applyNoIndexMeta(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${caseStudy.title} — Nikitha Bobbary`;
  }, [caseStudy]);

  return (
    <div className="case-detail-page">
      <Cursor />

      <header className="case-detail-nav">
        <div className="case-detail-nav__inner">
          <Link to={backHref} className="case-detail-nav__back">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
            <span>Cases</span>
          </Link>
          <Link to="/" className="case-detail-nav__brand">
            Nikitha Bobbary
          </Link>
        </div>
      </header>

      <main className="case-detail-main">
        <div className="case-detail-hero">
          <div className="case-detail-hero__top">
            <span className="case-detail-hero__kicker">Case Study</span>
            <span className="case-detail-hero__year">{caseStudy.year}</span>
          </div>

          <h1 className="case-detail-hero__title">{caseStudy.title}</h1>
          <p className="case-detail-hero__dek">{caseStudy.tagline}</p>

          <div className="case-detail-meta-grid">
            <div className="case-detail-meta-item">
              <span className="case-detail-meta-label">Role</span>
              <span className="case-detail-meta-value">{caseStudy.role}</span>
            </div>
            <div className="case-detail-meta-item">
              <span className="case-detail-meta-label">Services</span>
              <span className="case-detail-meta-value">
                {caseStudy.categories.join(" · ")}
              </span>
            </div>
            <div className="case-detail-meta-item">
              <span className="case-detail-meta-label">Deliverables</span>
              <span className="case-detail-meta-value">
                {caseStudy.deliverables.slice(0, 2).join(", ")}
              </span>
            </div>
          </div>
        </div>

        <div className="case-detail-cover">
          <figure className="case-detail-cover__figure">
            <img
              src={caseStudy.image}
              alt={caseStudy.alt}
              width={caseStudy.width}
              height={caseStudy.height}
              className="case-detail-cover__img"
            />
          </figure>
        </div>

        <section className="case-detail-narrative">
          <div className="case-detail-block">
            <h2 className="case-detail-block__title">The Challenge</h2>
            <p className="case-detail-block__text">{caseStudy.challenge}</p>
          </div>

          <div className="case-detail-block">
            <h2 className="case-detail-block__title">The Approach</h2>
            <p className="case-detail-block__text">{caseStudy.approach}</p>
          </div>

          {caseStudy.metrics?.length ? (
            <div className="case-detail-metrics">
              <h2 className="case-detail-metrics__title">Key Impacts</h2>
              <div className="case-detail-metrics__grid">
                {caseStudy.metrics.map(({ label, value }) => (
                  <div key={label} className="case-detail-metric-card">
                    <span className="case-detail-metric-value">{value}</span>
                    <span className="case-detail-metric-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <nav className="case-detail-pagination" aria-label="Next case study">
          <Link
            to={isWork ? `/${nextCase.slug}` : `/work/${nextCase.slug}`}
            className="case-detail-next-card"
          >
            <div className="case-detail-next-card__meta">
              <span className="case-detail-next-card__kicker">Next Case Study</span>
              <h3 className="case-detail-next-card__title">{nextCase.title}</h3>
              <p className="case-detail-next-card__tags">
                {nextCase.categories.join(" · ")}
              </p>
            </div>
            <div className="case-detail-next-card__icon" aria-hidden="true">
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} strokeWidth={1.5} />
            </div>
          </Link>
        </nav>
      </main>

      <footer className="case-detail-footer">
        <p className="case-detail-footer__copyright">
          © {new Date().getFullYear()} Nikitha Bobbary ·{" "}
          <Link to={backHref} className="case-detail-footer__link">
            Return to Overview
          </Link>
        </p>
      </footer>
    </div>
  );
}
