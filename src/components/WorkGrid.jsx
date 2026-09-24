import { Link } from "react-router-dom";
import { WORK_CASE_STUDIES } from "../data/workCases.js";
import { isWorkDomain } from "../utils/domain.js";

export default function WorkGrid() {
  const isWork = isWorkDomain();

  return (
    <section
      id="cases"
      className="work-grid-section"
      aria-labelledby="cases-heading"
    >
      <div className="work-grid-section__inner">
        <div className="work-grid-header">
          <h2 id="cases-heading" className="work-grid-header__title">
            Case Studies
          </h2>
        </div>

        <div className="work-grid">
          {WORK_CASE_STUDIES.map(({ id, slug, title, categories, image, width, height, alt }) => {
            const cardHref = isWork ? `/${slug || id}` : `/work/${slug || id}`;

            return (
              <article key={id} className="work-card">
                <Link
                  to={cardHref}
                  className="work-card__link"
                  aria-label={`View case study: ${title}`}
                >
                  <div className="work-card__media">
                    <img
                      src={image}
                      alt={alt || title}
                      width={width}
                      height={height}
                      className="work-card__image"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="work-card__action" aria-hidden="true">
                      <svg
                        className="work-card__action-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>

                  <div className="work-card__meta">
                    <h3 className="work-card__title">{title}</h3>
                    <p className="work-card__tags">
                      {categories.join(" · ")}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
