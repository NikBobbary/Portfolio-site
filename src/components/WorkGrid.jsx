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
              image,
              width,
              height,
              alt,
            } = caseStudy;
            const cardHref = `/${slug || id}`;
            const accent = ACCENT_MAP[id] || "neutral";
            const displayTitle = heroTitle || title;

            return (
              <Link
                key={id}
                to={cardHref}
                className={`case-card case-card--${accent}`}
                aria-label={`View ${displayTitle} case study`}
              >
                {/* Column 1 (Left): Title (Top-Aligned) */}
                <div className="case-card__title-col">
                  <h3 className="case-card__title">
                    <span className="case-card__title-link">
                      {displayTitle}
                    </span>
                  </h3>
                </div>

                {/* Column 2 (Middle): Image / Device Screen Mockup */}
                <div className="case-card__media">
                  <div className="case-card__mockup-link">
                    <ScreenMockup
                      src={image}
                      alt={alt || `${displayTitle} screen mockup`}
                      width={width}
                      height={height}
                      accent={accent}
                    />
                  </div>
                </div>

                {/* Column 3 (Right): Summary Paragraph & CTA (Bottom-Aligned) */}
                <div className="case-card__summary-col">
                  {summary ? (
                    <p className="case-card__summary">{summary}</p>
                  ) : null}
                  <div className="case-card__cta-row">
                    <span className="case-card__cta-btn">
                      View case study
                      <svg
                        className="case-card__cta-btn-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
