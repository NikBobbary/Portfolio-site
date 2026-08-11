import { useCallback, useEffect, useState } from "react";
import Cursor from "../components/Cursor.jsx";
import StoryToc from "../components/StoryToc.jsx";
import { STORY_META, STORY_SECTIONS } from "../data/projectStory.js";

function StoryBlock({ block }) {
  switch (block.type) {
    case "lead":
      return <p className="story-block story-block--lead">{block.text}</p>;
    case "p":
      return <p className="story-block">{block.text}</p>;
    case "punch":
      return <p className="story-block story-block--punch">{block.text}</p>;
    case "pull":
      return <blockquote className="story-pull">{block.text}</blockquote>;
    case "insight":
      return (
        <aside className="story-insight">
          <p>{block.text}</p>
        </aside>
      );
    case "example":
      return (
        <div className="story-example">
          <p>{block.text}</p>
        </div>
      );
    case "thesis":
      return <p className="story-thesis">{block.text}</p>;
    case "steps":
      return (
        <ol className="story-steps">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "principles":
      return (
        <ol className="story-principles">
          {block.items.map((item, index) => (
            <li key={item}>
              <span className="story-principles__n" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "questions":
      return (
        <ul className="story-questions">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "contrast":
      return (
        <div className="story-contrast" role="group" aria-label="Question shift">
          <p className="story-contrast__before">
            <span className="story-contrast__tag">Was</span>
            {block.before}
          </p>
          <p className="story-contrast__after">
            <span className="story-contrast__tag">Became</span>
            {block.after}
          </p>
        </div>
      );
    case "moment":
      return (
        <article className="story-moment">
          <h3 className="story-moment__title">{block.title}</h3>
          <ul className="story-moment__list">
            {block.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {block.closer ? (
            <p className="story-moment__closer">{block.closer}</p>
          ) : null}
        </article>
      );
    case "map":
      return (
        <ul className="story-map">
          {block.items.map(({ finding, move }) => (
            <li key={finding} className="story-map__item">
              <p className="story-map__finding">{finding}</p>
              <p className="story-map__move">{move}</p>
            </li>
          ))}
        </ul>
      );
    case "pair":
      return (
        <div className="story-pair">
          {block.items.map(({ title, text }) => (
            <article key={title} className="story-pair__card">
              <h3 className="story-pair__title">{title}</h3>
              <p className="story-pair__text">{text}</p>
            </article>
          ))}
        </div>
      );
    case "close":
      return (
        <div className="story-close">
          {block.lines.map((line, index) => (
            <p
              key={line}
              className={
                index === block.lines.length - 1
                  ? "story-close__line story-close__line--end"
                  : "story-close__line"
              }
            >
              {line}
            </p>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function ProjectHome() {
  const [activeId, setActiveId] = useState(STORY_SECTIONS[0].id);
  const [tocOpen, setTocOpen] = useState(false);
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    document.title = "The Story · How This Project Unfolded — Nikitha Bobbary";
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setIntro(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIntro(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const nodes = STORY_SECTIONS.map(({ id }) =>
      document.getElementById(id)
    ).filter(Boolean);

    if (!nodes.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5],
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const onNavigate = useCallback((event, id) => {
    event.preventDefault();
    setTocOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }, []);

  return (
    <div className={`story-page${intro ? " is-intro" : ""}`}>
      <Cursor />

      <header className="story-hero">
        <div className="story-hero__bar">
          <p className="story-hero__brand">Nikitha Bobbary</p>
          <p className="story-hero__eyebrow">{STORY_META.eyebrow}</p>
        </div>
        <div className="story-hero__inner">
          <p className="story-hero__kicker">{STORY_META.subtitle}</p>
          <h1 className="story-hero__title">{STORY_META.title}</h1>
          <p className="story-hero__dek">{STORY_META.dek}</p>
          <p className="story-hero__thesis">{STORY_META.thesis}</p>
        </div>
      </header>

      <div className="story-layout">
        <StoryToc
          sections={STORY_SECTIONS}
          activeId={activeId}
          open={tocOpen}
          onToggle={() => setTocOpen((value) => !value)}
          onNavigate={onNavigate}
        />

        <main className="story-main">
          {STORY_SECTIONS.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="story-section"
              aria-labelledby={`${section.id}-heading`}
            >
              <header className="story-section__head">
                <span className="story-section__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2
                  id={`${section.id}-heading`}
                  className="story-section__title"
                >
                  {section.label}
                </h2>
              </header>
              <div className="story-section__body">
                {section.blocks.map((block, blockIndex) => (
                  <StoryBlock
                    key={`${section.id}-${block.type}-${blockIndex}`}
                    block={block}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
