import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CASE_STUDIES } from "../data/cases.js";

export default function CaseStudies() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !pin || !viewport || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      section.classList.add("is-static");
      return undefined;
    }

    let extra = 0;
    let frame = 0;

    const measure = () => {
      extra = Math.max(0, track.scrollWidth - viewport.clientWidth);
      section.style.height = extra > 0 ? `calc(100svh + ${extra}px)` : "100svh";
    };

    const apply = () => {
      const view = window.innerHeight;
      const top = section.getBoundingClientRect().top;
      const bottom = section.getBoundingClientRect().bottom;

      if (top <= 0 && bottom >= view) {
        pin.style.position = "fixed";
        pin.style.top = "0";
        pin.style.bottom = "auto";
        const scrolled = Math.min(-top, extra);
        track.style.transform = `translate3d(${-scrolled}px, 0, 0)`;
        return;
      }

      if (bottom < view) {
        pin.style.position = "absolute";
        pin.style.top = "auto";
        pin.style.bottom = "0";
        track.style.transform = `translate3d(${-extra}px, 0, 0)`;
        return;
      }

      pin.style.position = "relative";
      pin.style.top = "auto";
      pin.style.bottom = "auto";
      track.style.transform = "translate3d(0, 0, 0)";
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };

    measure();
    apply();

    const observer = new ResizeObserver(() => {
      measure();
      apply();
    });
    observer.observe(viewport);
    observer.observe(track);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      section.style.height = "";
      pin.style.position = "";
      pin.style.top = "";
      pin.style.bottom = "";
      track.style.transform = "";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cases"
      className="cases"
      aria-labelledby="cases-heading"
    >
      <div ref={pinRef} className="cases__pin">
        <hr className="work-index" />
        <h2 id="cases-heading" className="cases__title">
          Case studies
        </h2>
        <div
          ref={viewportRef}
          className="cases__viewport"
          aria-label="Case studies"
        >
          <div ref={trackRef} className="cases__track">
            {CASE_STUDIES.map(({ id, name, href, src, chips }) => (
              <Link key={id} className="cases__card" to={href}>
                <figure className="cases__figure">
                  <img
                    src={src}
                    alt=""
                    width={2400}
                    height={1500}
                    draggable={false}
                  />
                </figure>
                <div className="cases__meta">
                  <p className="cases__name">{name}</p>
                  {chips.length > 0 ? (
                    <ul className="cases__chips" aria-label="Tags">
                      {chips.map((chip) => (
                        <li key={chip} className="cases__chip">
                          {chip}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Link>
            ))}
            <div className="cases__runway" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
