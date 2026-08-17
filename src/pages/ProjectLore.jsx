import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cursor from "../components/Cursor.jsx";
import StoryToc from "../components/StoryToc.jsx";
import { LORE_META, LORE_SECTIONS } from "../data/projectLore.js";

function LoreBlock({ block }) {
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
    case "bullets":
      return (
        <ul className="story-bullets">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "chat":
      return (
        <figure className="story-chat">
          <div className="story-chat__bubble">
            <p>{block.text}</p>
          </div>
          <figcaption className="story-chat__caption">
            Research artifact
          </figcaption>
        </figure>
      );
    case "stays-leaves":
      return (
        <div
          className="story-stays"
          role="group"
          aria-label="What stays versus what leaves"
        >
          <div className="story-stays__col story-stays__col--stays">
            <p className="story-stays__label">What stays</p>
            <ul className="story-stays__list">
              {block.stays.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="story-stays__col story-stays__col--leaves">
            <p className="story-stays__label">What leaves</p>
            <ul className="story-stays__list">
              {block.leaves.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
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
    case "pipeline":
      return (
        <ol className="story-pipeline" aria-label="Capture pipeline">
          {block.steps.map((step, index) => (
            <li key={step} className="story-pipeline__step">
              <span className="story-pipeline__n" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="story-pipeline__label">{step}</span>
            </li>
          ))}
        </ol>
      );
    case "bus-factor":
      return (
        <aside className="story-bus" aria-label="Knowledge health alert">
          <div className="story-bus__stat">
            <p className="story-bus__eyebrow">{block.label}</p>
            <p className="story-bus__value">{block.value}</p>
          </div>
          <div className="story-bus__copy">
            <p className="story-bus__area">{block.area}</p>
            <p className="story-bus__note">{block.note}</p>
          </div>
        </aside>
      );
    case "bets":
      return (
        <div className="story-bets" role="table" aria-label="The five bets">
          <div className="story-bets__head" role="row">
            <span role="columnheader">Bet</span>
            <span role="columnheader">In one line</span>
          </div>
          {block.items.map(({ bet, line }) => (
            <div key={bet} className="story-bets__row" role="row">
              <span className="story-bets__bet" role="cell">
                {bet}
              </span>
              <span className="story-bets__line" role="cell">
                {line}
              </span>
            </div>
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

export default function ProjectLore() {
  const [activeId, setActiveId] = useState(LORE_SECTIONS[0].id);
  const [tocOpen, setTocOpen] = useState(false);
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    document.title = `${LORE_META.title} — Nikitha Bobbary`;
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
    const sectionIds = LORE_SECTIONS.map(({ id }) => id);

    const syncActive = () => {
      const offset = window.innerHeight * 0.28;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const node = document.getElementById(id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      if (current) setActiveId(current);
    };

    syncActive();
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
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
          <Link className="story-hero__brand" to="/">
            Nikitha Bobbary
          </Link>
          <p className="story-hero__eyebrow">{LORE_META.eyebrow}</p>
        </div>
        <div className="story-hero__inner">
          <p className="story-hero__kicker">{LORE_META.kicker}</p>
          <h1 className="story-hero__title">{LORE_META.title}</h1>
          <p className="story-hero__dek">{LORE_META.dek}</p>
        </div>
      </header>

      <div className="story-layout">
        <StoryToc
          sections={LORE_SECTIONS}
          activeId={activeId}
          open={tocOpen}
          onToggle={() => setTocOpen((value) => !value)}
          onNavigate={onNavigate}
        />

        <main className="story-main">
          {LORE_SECTIONS.map((section, index) => (
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

              {section.blocks?.length ? (
                <div className="story-section__body">
                  {section.blocks.map((block, blockIndex) => (
                    <LoreBlock
                      key={`${section.id}-${block.type}-${blockIndex}`}
                      block={block}
                    />
                  ))}
                </div>
              ) : null}

              {section.children?.length ? (
                <div className="story-section__children">
                  {section.children.map((child) => (
                    <section
                      key={child.id}
                      id={child.id}
                      className="story-subsection"
                      aria-labelledby={`${child.id}-heading`}
                    >
                      <h3
                        id={`${child.id}-heading`}
                        className="story-subsection__title"
                      >
                        {child.label}
                      </h3>
                      <div className="story-section__body">
                        {child.blocks.map((block, blockIndex) => (
                          <LoreBlock
                            key={`${child.id}-${block.type}-${blockIndex}`}
                            block={block}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
