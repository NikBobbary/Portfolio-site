import { useId } from "react";

export default function StoryToc({
  sections,
  activeId,
  open,
  onToggle,
  onNavigate,
}) {
  const panelId = useId();

  const activeSection =
    sections.find((section) => section.id === activeId) ||
    sections.find((section) =>
      section.children?.some((child) => child.id === activeId)
    );
  const activeLabel = activeSection?.label || "Contents";

  return (
    <>
      <nav className="story-toc story-toc--desktop" aria-label="On this page">
        <p className="story-toc__eyebrow">On this page</p>
        <ol className="story-toc__list">
          {sections.map(({ id, label }, index) => (
            <li key={id} className="story-toc__item">
              <a
                href={`#${id}`}
                className={`story-toc__link${
                  activeSection?.id === id ? " is-active" : ""
                }`}
                aria-current={
                  activeSection?.id === id ? "location" : undefined
                }
                onClick={(event) => onNavigate(event, id)}
              >
                <span className="story-toc__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="story-toc__label">{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="story-toc-mobile">
        <button
          type="button"
          className={`story-toc-mobile__toggle${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="story-toc-mobile__meta">
            <span className="story-toc-mobile__eyebrow">On this page</span>
            <span className="story-toc-mobile__current">{activeLabel}</span>
          </span>
          <span className="story-toc-mobile__chevron" aria-hidden="true" />
        </button>
        <div
          id={panelId}
          className={`story-toc-mobile__panel${open ? " is-open" : ""}`}
          hidden={!open}
        >
          <nav aria-label="On this page">
            <ol className="story-toc__list">
              {sections.map(({ id, label }, index) => (
                <li key={id} className="story-toc__item">
                  <a
                    href={`#${id}`}
                    className={`story-toc__link${
                      activeSection?.id === id ? " is-active" : ""
                    }`}
                    aria-current={
                      activeSection?.id === id ? "location" : undefined
                    }
                    onClick={(event) => onNavigate(event, id)}
                  >
                    <span className="story-toc__index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="story-toc__label">{label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
}
