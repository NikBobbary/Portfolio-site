import { useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder.jsx";

/**
 * LessonpalSections: Complete Dark-Mode UX Case Study layout
 * 
 * Includes:
 * - Section 1: Intro (Lessonpal brought students and tutors together)
 * - Introductory Problem Cards (The co-ordination problem & relay)
 * - Section 2: The Shift in Strategy (Audit & Discovery, Redefining the Bottleneck)
 * - Section 3: Core Solution & Default Logic (Tutor availability default, Hi-Fi UI #1)
 * - Section 4: Edge Cases & Coordination vs System States (Alert notification & Hi-Fi UI #2)
 * - Section 5: Impact & Outcomes (Metrics & Designing Out the Middleman)
 */
export default function LessonpalSections() {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText("https://lessonpal.com/schedule/sarah-vance?direct=true");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

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
            {/* 6 columns: Text */}
            <div className="lp-section--intro__text">
              <h2 className="lp-section--intro__title cs-h2">
                Making tutoring more accessible
              </h2>
              <p className="lp-section--intro__desc cs-body">
                Lessonpal is a 1-on-1 tutoring marketplace connecting K–12 students with affordable, quality education worldwide.
              </p>
              <ul className="lp-section--intro__bullets cs-body">
                <li>Lower commission rates for tutors</li>
                <li>Simple tutor onboarding</li>
                <li>Easy tutor matching for students</li>
              </ul>
            </div>

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
      <div className="lp-section-spacer lp-section-spacer--intro" aria-hidden="true" />

      {/* —— Introductory Problem: The co-ordination problem —— */}
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
                src="/case-studies/lessonpal/lego-humans-seesaw.png"
                alt="Lego figures on seesaw representing student and tutor coordination"
                className="lp-lego-seesaw"
                width={533}
                height={315}
                loading="lazy"
              />
            </div>
          </div>

          {/* 1 column: Gap with vertical divider line */}
          <div className="lp-section--problem__divider-col" aria-hidden="true">
            <div className="lp-section--problem__line" />
          </div>

          <div className="lp-section--problem__right">
            <div className="lp-section--problem__lead">
              <h3 className="lp-section--problem__kicker cs-h3">
                Things don't always go <em>as planned</em>.
              </h3>
              <p className="cs-body">
                When a student needed to reschedule, they first agreed on a new time with their
                tutor. But because students couldn’t reschedule themselves, the request had to
                go through Support.
              </p>
            </div>

            <div className="lp-section--problem__relay">
              <h3 className="lp-section--problem__relay-title cs-h3">
                What happened next
              </h3>
              <div className="lp-section--problem__relay-grid">
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    Student agrees on a new time with the tutor, support team receives the
                    request and coordinates the change
                  </p>
                </div>
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    Dev team steps in. Time zones + manual delays mean the original lesson
                    can pass before the change is processed.
                  </p>
                </div>
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    If delayed, System marks the lesson as completed. Support team has to
                    coordinate again, and manually fix the schedule
                  </p>
                </div>
              </div>
            </div>

            <div className="lp-section--problem__stat-row">
              <div className="lp-section--problem__stat-content">
                <div className="lp-section--problem__stat-headline">
                  <span className="lp-problem-stat-num">~80</span>
                  <span className="lp-problem-stat-suffix">requests per week!</span>
                </div>
                <p className="lp-section--problem__stat-desc cs-body">
                  The support team flagged the issue during a weekly huddle, with 83
                  rescheduling requests coming in each week.
                </p>
              </div>

              <div className="lp-section--problem__stat-sticker">
                <img
                  src="/case-studies/lessonpal/exclamation.svg"
                  alt="Urgent coordination requests alert sticker"
                  className="lp-exclamation-sticker"
                  width={207}
                  height={195}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 2: THE SHIFT IN STRATEGY
          2-Column Asymmetrical Grid (12 cols: 7 left / 5 right)
         ======================================================== */}
      <section className="lp-section lp-section--strategy" id="section-strategy">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 7 */}
          <div className="lp-col-7 col-span-7 lp-strategy__left">
            <h2 className="lp-strategy__headline cs-h2">
              Redefining the Bottleneck
            </h2>

            <p className="lp-strategy__paragraph cs-body">
              The brief seemed simple: make rescheduling easier for Support. So I dug into
              the existing flow first—support conversations, booking and lesson states,
              where rescheduling was breaking, and the edge cases around it.
            </p>

            {/* Image Container: Placeholder box for <screenshots> */}
            <div className="lp-strategy__media-wrap">
              <ImagePlaceholder
                name="screenshots"
                alt="Support conversations audit and rescheduling flow breakdown"
                caption="Support triage transcripts & early flow audit mapping manual escalation bottlenecks"
                badge="Audit: Support Conversations"
                aspectRatio="16 / 9"
                fallbackType="screenshots"
                src="/Screens/1400/lessonpal-4.jpg"
              />
            </div>

            <p className="lp-strategy__paragraph cs-body">
              Pretty quickly, it became clear this wasn’t just a missing feature.
              Rescheduling touched student and tutor availability, lesson states, and who
              was responsible for each change.
            </p>
          </div>

          {/* Right Column: Col-Span 5 - Highlight Card */}
          <div className="lp-col-5 col-span-5 lp-strategy__right">
            <div className="lp-highlight-card">
              <p className="lp-highlight-card__body cs-body">
                My first approach was to let Support reschedule lessons themselves. That
                removed the dev dependency and made the process faster. But users still
                had to go through Support. We had just moved the bottleneck.
              </p>

              {/* Callout Highlight Box (Large Typography with Accent Border/Text) */}
              <div className="lp-callout-box">
                <span className="lp-callout-box__quotemark">“</span>
                <p className="lp-callout-box__quote">
                  That made me look at the process again: could we remove the need for Support altogether?
                </p>
              </div>

              {/* Quote / Verdict Text */}
              <div className="lp-verdict-box">
                <div className="lp-verdict-box__indicator" />
                <p className="lp-verdict-box__text cs-body">
                  The problem changed. It wasn’t that Support needed a better rescheduling
                  tool. Users needed control over rescheduling their own lessons. That changed
                  the direction of the product—from making Support faster to removing Support
                  from the normal path altogether.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 3: CORE SOLUTION & DEFAULT LOGIC
          2-Column Grid (12 cols: 4 left / 8 right)
         ======================================================== */}
      <section className="lp-section lp-section--solution" id="section-core-solution">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 4 - System Logic Overview */}
          <div className="lp-col-4 col-span-4 lp-solution__left">
            <h2 className="lp-solution__headline cs-h2">
              We used tutor availability as the default
            </h2>

            <p className="lp-solution__desc cs-body">
              Students could reschedule directly from the tutor’s existing availability.
              Since that information already existed, there was no reason to collect student
              availability too. Tutors could still make exceptions and offer a different
              time when needed.
            </p>

            {/* Key Takeaway Box */}
            <div className="lp-takeaway-card">
              <div className="lp-takeaway-card__header">
                <span className="lp-takeaway-card__icon">⚡</span>
                <span className="lp-takeaway-card__label cs-code2">Key Principle</span>
              </div>
              <p className="lp-takeaway-card__text cs-body">
                This kept the scheduling model simple: use what the system knows, instead
                of collecting more information just in case.
              </p>
            </div>
          </div>

          {/* Right Column: Col-Span 8 - Primary UI Showcase */}
          <div className="lp-col-8 col-span-8 lp-solution__right">
            <div className="lp-showcase-frame">
              <ImagePlaceholder
                name="hifi design#1"
                alt="Student-facing rescheduling interface hi-fi design showcase"
                caption="Student-facing reschedule window with live calendar synchronization and auto timezone translation"
                badge="Hi-Fi Desktop UI #1: Student Flow"
                aspectRatio="16 / 10"
                fallbackType="hifi-1"
                src="/Screens/1400/lessonpal-1.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "24%",
                    y: "32%",
                    tag: "Availability Sync",
                    title: "Tutor Availability as Default",
                    text: "Synchronizes directly against the educator's live slots without waiting on manual confirmation.",
                  },
                  {
                    id: 2,
                    x: "72%",
                    y: "48%",
                    tag: "Timezone Engine",
                    title: "Conflict-Free Rebooking",
                    text: "Automatically renders corresponding timezone differentials to prevent cross-country scheduling errors.",
                  },
                  {
                    id: 3,
                    x: "82%",
                    y: "78%",
                    tag: "1-Click State Update",
                    title: "Instant Confirmation",
                    text: "Updates database lesson state immediately; triggers SMS and email calendar invites to both parties.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 4: EDGE CASES & COORDINATION VS SYSTEM STATES
          2-Column Balanced Modular Grid (grid-cols-2 / 6 cols each)
         ======================================================== */}
      <section className="lp-section lp-section--edge-cases" id="section-edge-cases">
        <div className="lp-section__container lp-grid-balanced grid-cols-2">
          {/* Left Card: Edge Cases & Boundaries */}
          <div className="lp-card lp-card--modular lp-edge-card">
            <h2 className="lp-card__headline cs-h2">
              Not every problem needed another system state
            </h2>

            <p className="lp-card__text cs-body">
              There were real edge cases to handle — a lesson being scheduled after its
              start time, a slot already being booked, overlapping bookings, and other timing
              conflicts. But a tutor rescheduling without knowing the student’s availability
              was different. It was a coordination gap, not an edge case.
            </p>

            {/* Feature Highlight Component: Mini Alert Notification Preview */}
            <div className="lp-alert-preview">
              <div className="lp-alert-preview__bar">
                <div className="lp-alert-preview__badge">
                  <span className="lp-alert-preview__icon">⚠️</span>
                  <span className="lp-alert-preview__tag cs-code2">System Coordination Alert</span>
                </div>
                <span className="lp-alert-preview__status cs-code2">Live in production</span>
              </div>

              <div className="lp-alert-preview__content">
                <p className="lp-alert-preview__message">
                  <strong>Need to offer a custom slot?</strong> Send a quick scheduling link
                  so your student can pick an alternative time that fits their calendar.
                </p>

                <div className="lp-alert-preview__actions">
                  <button
                    type="button"
                    className="lp-alert-preview__btn lp-alert-preview__btn--primary"
                    onClick={handleCopyLink}
                  >
                    {copiedLink ? "✓ Link Copied to Clipboard" : "Copy Student Scheduling Link"}
                  </button>
                  <span className="lp-alert-preview__subtext cs-code2">
                    Direct tokenized invite
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Incentive Model & UI */}
          <div className="lp-card lp-card--modular lp-edge-card">
            <div className="lp-edge-narrative">
              <p className="lp-card__text cs-body">
                Adding mandatory student confirmation would turn that gap into a dependency:
                tutor proposes → student responds → reschedule waits. Instead, I suggested
                a small alert on the website prompting the tutor to reach out to the student
                with a scheduling link.
              </p>

              <p className="lp-card__text cs-body">
                Tutors also only got paid when a lesson was completed. If a lesson wasn’t
                delivered, the student could mark it as such and the tutor wouldn’t get paid.
                So the system handled what it knew, and prompted people to coordinate when it didn’t.
              </p>
            </div>

            {/* Image Container: Asset container for <hifi design#2> */}
            <div className="lp-edge-media">
              <ImagePlaceholder
                name="hifi design#2"
                alt="Tutor coordination alert and incentive verification interface"
                caption="In-app coordination trigger: System manages validated states while human incentive guides offline agreements"
                badge="Hi-Fi Desktop UI #2: Coordination Trigger"
                aspectRatio="16 / 10"
                fallbackType="hifi-2"
                src="/Screens/1400/lessonpal-5.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 5: IMPACT & OUTCOMES
          3-Column Stats & Closing Card (grid-cols-12: 4 / 4 / 4)
         ======================================================== */}
      <section className="lp-section lp-section--impact" id="section-impact">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Section Heading: Numbers */}
          <div className="lp-col-12 col-span-12 lp-impact__header">
            <h2 className="lp-impact__title">
              Numbers
            </h2>
          </div>

          {/* Stat Card 1: Col-Span 4 */}
          <div className="lp-col-4 col-span-4 lp-stat-card">
            <div className="lp-stat-card__inner">
              <div className="lp-stat-card__metric lp-stat-card__metric--accent">
                83 / 149
              </div>
              <p className="lp-stat-card__label cs-body">
                Weekly rescheduling requests automated directly by users.
              </p>
              <div className="lp-stat-card__footer cs-code2">
                <span className="lp-stat-card__pill">Self-Served Flow</span>
                <span>Zero Support Tickets</span>
              </div>
            </div>
          </div>

          {/* Stat Card 2: Col-Span 4 */}
          <div className="lp-col-4 col-span-4 lp-stat-card">
            <div className="lp-stat-card__inner">
              <div className="lp-stat-card__metric lp-stat-card__metric--white">
                +55%
              </div>
              <p className="lp-stat-card__label cs-body">
                Improvement in overall user satisfaction.
              </p>
              <div className="lp-stat-card__footer cs-code2">
                <span className="lp-stat-card__pill">Post-Release CSAT</span>
                <span>Reduced Wait Times</span>
              </div>
            </div>
          </div>

          {/* Closing Narrative Card: Col-Span 4 */}
          <div className="lp-col-4 col-span-4 lp-closing-card">
            <div className="lp-closing-card__inner">
              <h3 className="lp-closing-card__headline cs-h3">
                Designing Out the Middleman
              </h3>

              <p className="lp-closing-card__desc cs-body">
                The product handled what Support used to. Support no longer had to manually
                coordinate every change. The bigger win was simpler: students and tutors
                could manage their own schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: LEARNINGS
          2-Column Layout (7 cols left text / 5 cols right lego diorama)
         ======================================================== */}
      <section className="lp-section lp-section--learnings" id="section-learnings">
        <div className="lp-section__container lp-grid-12 grid-cols-12 lp-learnings__container">
          {/* Left Column: Headline + Bullet List */}
          <div className="lp-col-7 col-span-7 lp-learnings__left">
            <h2 className="lp-learnings__title">
              Learnings
            </h2>

            <ul className="lp-learnings__list">
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet" aria-hidden="true" />
                <p className="lp-learnings__text">
                  Digging into Support bottlenecks revealed a larger product feature waiting to be built.
                </p>
              </li>
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet" aria-hidden="true" />
                <p className="lp-learnings__text">
                  Listening to support calls directly shaped our understanding of real user edge cases.
                </p>
              </li>
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet" aria-hidden="true" />
                <p className="lp-learnings__text">
                  Removing middle-man steps proved better than simply speeding up support workflows.
                </p>
              </li>
            </ul>
          </div>

          {/* Right Column: Lego Researcher Minifigure Diorama */}
          <div className="lp-col-5 col-span-5 lp-learnings__right">
            <div className="lp-learnings__media-wrap">
              <img
                src="/case-studies/lessonpal/lego-learnings.png"
                alt="Lego researcher minifigure exploring with tablet, book, lamp, and magnifying glass"
                className="lp-learnings__lego-img"
                width={708}
                height={640}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
