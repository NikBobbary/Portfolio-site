import { useEffect, useRef, useState } from "react";

function DoodleCircle({ className = "" }) {
  return (
    <svg
      className={`about__doodle about__doodle--circle ${className}`}
      viewBox="0 0 120 48"
      aria-hidden="true"
    >
      {/* messy first pass — wobbly oval that overshoots the close */}
      <path
        className="about__ink"
        d="M18 28
           C14 14, 32 4, 58 5
           C82 6, 108 10, 112 22
           C116 34, 98 44, 72 45
           C48 46, 22 40, 16 28
           C14 22, 24 16, 38 15"
        fill="none"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      {/* second pass — slightly offset, incomplete loop */}
      <path
        className="about__ink about__ink--soft"
        d="M22 20
           C28 8, 55 2, 80 6
           C102 10, 114 18, 110 30
           C106 40, 84 46, 58 44
           C36 42, 18 36, 20 26
           C22 18, 40 12, 56 12"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
    </svg>
  );
}

function DoodleWave({ className = "" }) {
  return (
    <svg
      className={`about__doodle about__doodle--wave ${className}`}
      viewBox="0 0 160 20"
      aria-hidden="true"
    >
      <path
        className="about__ink"
        d="M4 10c14 8 22-6 36 0s24-8 38 0 24-6 36 0 22-8 34 2"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}

function DoodleScribble({ className = "" }) {
  return (
    <svg
      className={`about__doodle about__doodle--scribble ${className}`}
      viewBox="0 0 120 48"
      aria-hidden="true"
    >
      <path
        className="about__ink about__ink--accent"
        d="M18 28
           C14 14, 32 4, 58 5
           C82 6, 108 10, 112 22
           C116 34, 98 44, 72 45
           C48 46, 22 40, 16 28
           C14 22, 24 16, 38 15"
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      <path
        className="about__ink about__ink--accent about__ink--soft"
        d="M22 20
           C28 8, 55 2, 80 6
           C102 10, 114 18, 110 30
           C106 40, 84 46, 58 44
           C36 42, 18 36, 20 26
           C22 18, 40 12, 56 12"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
    </svg>
  );
}

function DoodleCheck({ className = "" }) {
  return (
    <svg
      className={`about__doodle about__doodle--check ${className}`}
      viewBox="0 0 28 24"
      aria-hidden="true"
    >
      <path
        className="about__ink about__ink--accent"
        d="M4 12l7 8L24 4"
        fill="none"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
    </svg>
  );
}

function DoodleStar({ className = "" }) {
  return (
    <svg
      className={`about__doodle about__doodle--star ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        className="about__ink about__ink--fill"
        d="M12 2l2.2 6.4H21l-5.2 4 2 6.6L12 15.2 6.2 19l2-6.6L3 8.4h6.8z"
        stroke="none"
        pathLength="1"
      />
    </svg>
  );
}

function DoodleArrow({ className = "" }) {
  return (
    <svg
      className={`about__doodle about__doodle--arrow ${className}`}
      viewBox="0 0 56 52"
      aria-hidden="true"
    >
      {/* tail at scribble (top-left) → head where the note begins */}
      <path
        className="about__ink about__ink--accent"
        d="M6 4c4 16 18 30 42 42"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="1"
      />
      <path
        className="about__ink about__ink--accent"
        d="M36 38l14 8-12 4"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
    </svg>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about${drawn ? " is-drawn" : ""}`}
      aria-labelledby="about-heading"
    >
      <div className="about__stage">
        <div className="about__typed">
          <p className="about__lead" id="about-heading">
            i&apos;m nikitha—
            <DoodleStar className="about__doodle--lead-star" />
          </p>

          <p className="about__body">
            a designer of{" "}
            <span className="about__mark">
              systems
              <DoodleCircle />
            </span>
            ,{" "}
            <span className="about__mark">
              brand
              <DoodleCircle className="about__doodle--tight" />
            </span>
            , and{" "}
            <span className="about__mark about__mark--check">
              craft
              <DoodleCheck />
            </span>{" "}
            — building products where people{" "}
            <span className="about__mark about__mark--wave">
              find each other
              <DoodleWave />
            </span>
            .
          </p>

          <p className="about__body about__body--punch">
            my head is rarely this{" "}
            <span className="about__mark about__mark--quiet">
              quiet
              <DoodleScribble />
              <span className="about__aside" aria-hidden="true">
                <DoodleArrow />
                <span className="about__note">
                  on purpose—
                  <br />
                  not empty
                </span>
              </span>
            </span>
            .. i just don&apos;t believe my work has to be{" "}
            <span className="about__mark about__mark--wave">
              loud
              <DoodleWave />
            </span>{" "}
            to prove it.
          </p>

          <p className="about__note about__note--float" aria-hidden="true">
            range ≠ volume
          </p>
        </div>

        <div className="about__portrait" aria-hidden="true">
          <img
            className="about__desk"
            src="/Screens/about-desk.svg"
            alt=""
            draggable={false}
          />
          <span className="about__desk-life" />
        </div>
      </div>
    </section>
  );
}
