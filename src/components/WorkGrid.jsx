import { Link } from "react-router-dom";
import { WORK_CASE_STUDIES } from "../data/workCases.js";
import ScreenMockup from "./ScreenMockup.jsx";

const ACCENT_MAP = {
  lessonpal: "amber",
  dyocar: "emerald",
  pairty: "indigo",
};

export default function WorkGrid() {
  return (
    <section
      id="cases"
      className="work-vertical-section work-grid-section"
      aria-label="Case Studies"
    >
      <div className="work-vertical-section__inner">
        <div className="cases-list">
          {WORK_CASE_STUDIES.map((caseStudy) => {
            const {
              id,
              slug,
              title,
              heroTitle,
              summary,
              highlights,
              image,
              width,
              height,
              alt,
            } = caseStudy;
            const cardHref = `/${slug || id}`;
            const accent = ACCENT_MAP[id] || "neutral";
            const displayTitle = heroTitle || title;

            return (
              <article key={id} className={`case-card case-card--${accent}`}>
                {/* Left Column: Content */}
                <div className="case-card__content">
                  {/* Single flex container for Title, Summary & Highlights */}
                  <div className="case-card__text-group">
                    <h3 className="case-card__title">
                      <Link to={cardHref} className="case-card__title-link">
                        {displayTitle}
                      </Link>
                    </h3>

                    {/* Case Study Intro/Content */}
                    {summary ? (
                      <p className="case-card__summary">{summary}</p>
                    ) : null}

                    {/* Scannable Highlights/Pillars */}
                    {highlights && highlights.length > 0 ? (
                      <ul className="case-card__highlights" aria-label="Key highlights">
                        {highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="case-card__highlight-item">
                            <span className="case-card__highlight-dash" aria-hidden="true">—</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>

                {/* Right Column: Image / Device Screen Mockup */}
                <div className="case-card__media">
                  <Link
                    to={cardHref}
                    className="case-card__mockup-link"
                    aria-label={`View ${title} case study`}
                  >
                    <ScreenMockup
                      src={image}
                      alt={alt || `${displayTitle} screen mockup`}
                      width={width}
                      height={height}
                      accent={accent}
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
