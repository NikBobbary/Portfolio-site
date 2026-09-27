export default function LessonpalSections() {
  return (
    <div className="lp-case-study">
      {/* —— Section 1: Lessonpal brought students and tutors together —— */}
      <section className="lp-section lp-section--intro">
        <div className="lp-section--intro__container">
          {/* 3 columns: Sticker bust (0.25fr / 3 of 12) */}
          <div className="lp-section--intro__sticker">
            <img
              src="/case-studies/lessonpal/socrates-sticker.png"
              alt="Socrates with graduation cap sticker"
              className="lp-sticker-bust"
              loading="lazy"
            />
          </div>

          {/* 1 column: Gap with vertical divider line */}
          <div className="lp-section--intro__divider-col" aria-hidden="true">
            <div className="lp-section--intro__line" />
          </div>

          {/* 8 columns: Text + Logo container (8/12 part) */}
          <div className="lp-section--intro__text-logo">
            {/* 5 columns: Text */}
            <div className="lp-section--intro__text">
              <h2 className="lp-section--intro__title cs-h2">
                Lessonpal brought students and tutors together
              </h2>
              <p className="lp-section--intro__desc cs-body">
                Students could find a tutor, book a one-on-one lesson, and come back
                for the next one.
              </p>
            </div>

            {/* 1 column: Gap within Text + Logo */}
            <div className="lp-section--intro__inner-gap" aria-hidden="true" />

            {/* 2 columns: Logo */}
            <div className="lp-section--intro__logo-wrap">
              <img
                src="/case-studies/lessonpal/lessonpal-logo.png"
                alt="Lessonpal logo"
                className="lp-logo-badge"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* —— Section 2: The co-ordination problem —— */}
      <section className="lp-section lp-section--problem">
        <div className="lp-section--problem__container">
          <div className="lp-section--problem__left">
            <h2 className="lp-section--problem__title cs-h1">
              The co-ordination
              <br />
              problem
            </h2>
            <div className="lp-section--problem__seesaw-wrap">
              <img
                src="/case-studies/lessonpal/lego-seesaw.png"
                alt="Lego seesaw representing coordination between tutor and student"
                className="lp-lego-seesaw"
                width={420}
                height={214}
                loading="lazy"
              />
            </div>
          </div>

          <div className="lp-section--problem__right">
            <h3 className="lp-section--problem__kicker cs-h3">
              Things don't always go <em>as planned</em>.
            </h3>
            <div className="lp-section--problem__body">
              <p className="cs-body">
                A student might have to move a lesson. A tutor might become unavailable.
              </p>
              <p className="cs-body">
                Two people, often in different time zones, suddenly had to find another
                time that worked for both of them.
              </p>
              <p className="cs-body">
                At the time, Lessonpal could handle the booking, but{" "}
                <strong>
                  <em>any changes had to go through support</em>
                </strong>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
