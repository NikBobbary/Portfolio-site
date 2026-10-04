import { useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder.jsx";

/**
 * DyocarSections: Complete Dark-Mode UX Case Study layout for Dyocar
 * 
 * Includes:
 * - Section 1: Intro (Frictionless mobility in high-density cities)
 * - Section 2: The Two-Sided Breakdown (Problem & Relay)
 * - Section 3: The Operational Shift (Command Center & Async Triage)
 * - Section 4: Consumer Discovery & Walk-in Hub Incentives
 * - Section 5: The Vehicle Catalog & The Doorstep Toggle
 * - Section 6: Edge Cases & The Post-Booking "Prep-Lock" Personalization Window
 * - Section 7: Design System for High-Stress Operations
 * - Section 8: Impact & Outcomes (Metrics)
 * - Section 9: Key Learnings
 */
export default function DyocarSections() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState({
    scent: true,
    babySeat: false,
    delivery: false,
    snacks: true,
  });

  const handleCopyLink = () => {
    navigator.clipboard?.writeText("https://dyocar.com/kyc/verify?token=dyo-2026-0152");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  const toggleAddon = (key) => {
    setSelectedAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Base price: ₹22,851 (2 days 8 hrs)
  const basePrice = 22851;
  const addonPrices = {
    scent: 0,
    babySeat: 450,
    delivery: 320,
    snacks: 280,
  };

  const currentAddonsTotal = Object.entries(selectedAddons).reduce(
    (sum, [key, active]) => sum + (active ? addonPrices[key] : 0),
    0
  );
  const calculatedTotal = basePrice + currentAddonsTotal;

  return (
    <div className="lp-case-study dy-case-study">
      {/* —— Section 1: Intro (Dyocar: Frictionless Mobility) —— */}
      <section className="lp-section lp-section--intro">
        <div className="lp-section--intro__container">
          {/* 3 columns: Driver Bust Sticker */}
          <div className="lp-section--intro__sticker">
            <img
              src="/case-studies/dyocar/driver-bust-sticker.jpg"
              alt="Classical statue bust with aviator driving goggles sticker"
              className="lp-sticker-bust dy-driver-bust"
              loading="lazy"
            />
          </div>

          {/* 1 column: Gap with vertical divider line */}
          <div className="lp-section--intro__divider-col" aria-hidden="true">
            <div className="lp-section--intro__line" />
          </div>

          {/* 8 columns: Text + Logo container */}
          <div className="lp-section--intro__text-logo">
            {/* 6 columns: Text */}
            <div className="lp-section--intro__text">
              <h2 className="lp-section--intro__title cs-h2">
                Car rental without the anxiety
              </h2>
              <p className="lp-section--intro__desc cs-body">
                Dyocar is an on-demand self-drive car rental platform built from 0→1 in Bengaluru.
                We paired a consumer discovery app with an operational command center to eliminate
                the friction and ambiguity that plagues urban car rentals.
              </p>
              <ul className="lp-section--intro__bullets cs-body">
                <li>15-minute guaranteed booking confirmation SLA</li>
                <li>Neighborhood walk-in hub savings vs doorstep delivery</li>
                <li>Dynamic in-cabin personalization (aroma, child seats, dashcams)</li>
              </ul>
            </div>

            {/* 2 columns: Logo */}
            <div className="lp-section--intro__logo-wrap">
              <img
                src="/case-studies/dyocar/dyocar-logo.svg"
                alt="Dyocar logo"
                className="dy-logo-badge"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer lp-section-spacer--intro" aria-hidden="true" />

      {/* —— Section 2: Problem: The Two-Sided Breakdown —— */}
      <section className="lp-section lp-section--problem">
        <div className="lp-section--problem__container">
          <div className="lp-section--problem__left">
            <h2 className="lp-section--problem__title cs-h1">
              The two-sided
              <br />
              breakdown
            </h2>
            <div className="lp-section--problem__seesaw-wrap">
              <img
                src="/case-studies/dyocar/lego-handoff.jpg"
                alt="Lego diorama of an impatient driver checking watch next to a dispatch desk with car keys"
                className="lp-lego-seesaw"
                width={700}
                height={394}
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
                Booking is simple. <em>Fulfillment is where car rental falls apart.</em>
              </h3>
              <p className="cs-body">
                In dense Indian metros, renting a car is notorious for high anxiety. Customers pay
                upfront, but then wait in limbo without knowing if their government KYC will pass,
                whether the car will arrive clean, or if it will be swapped last-minute for a beat-up
                alternative.
              </p>
            </div>

            <div className="lp-section--problem__relay">
              <h3 className="lp-section--problem__relay-title cs-h3">
                Where the system fractured
              </h3>
              <div className="lp-section--problem__relay-grid">
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    <strong>1. Synchronous KYC Drop-off</strong>
                    <br />
                    When users skipped DigiLocker at checkout, legacy flows blocked the booking,
                    cancelling high-intent users before human review could step in.
                  </p>
                </div>
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    <strong>2. Hub Blindspots & Delays</strong>
                    <br />
                    Host vehicles frequently returned late from prior trips. Hub dispatchers had no
                    one-click way to commit an alternative car of the same class.
                  </p>
                </div>
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    <strong>3. Silent SLA Breaches</strong>
                    <br />
                    Without real-time countdown alerts, desk agents took 45+ minutes to process
                    documents. Anxious users gave up and booked cabs instead.
                  </p>
                </div>
              </div>
            </div>

            <div className="lp-section--problem__stat-row">
              <div className="lp-section--problem__stat-content">
                <div className="lp-section--problem__stat-headline">
                  <span className="lp-problem-stat-num">~65%</span>
                  <span className="lp-problem-stat-suffix">churn during verification wait</span>
                </div>
                <p className="lp-section--problem__stat-desc cs-body">
                  Early funnel analytics revealed that nearly two-thirds of cancellations occurred
                  in the silent gap between payment confirmation and car assignment.
                </p>
              </div>

              <div className="lp-section--problem__stat-sticker">
                <img
                  src="/case-studies/dyocar/speedometer.svg"
                  alt="15 minute SLA countdown speedometer badge"
                  className="lp-exclamation-sticker"
                  width={120}
                  height={120}
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
          SECTION 3: THE SHIFT IN STRATEGY (COMMAND CENTER & ASYNC TRIAGE)
          2-Column Asymmetrical Grid (12 cols: 7 left / 5 right)
         ======================================================== */}
      <section className="lp-section lp-section--strategy" id="section-strategy">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 7 */}
          <div className="lp-col-7 col-span-7 lp-strategy__left">
            <h2 className="lp-strategy__headline cs-h2">
              Redefining the Operations Engine
            </h2>

            <p className="lp-strategy__paragraph cs-body">
              The initial brief was to optimize the customer booking form. But shadowing hub dispatchers
              at the Indiranagar and Koramangala hubs revealed the true bottleneck: operations was
              drowning in chaotic, asynchronous signals across WhatsApp groups and paper checklists.
            </p>

            {/* Image Container: Desk Command Center */}
            <div className="lp-strategy__media-wrap">
              <ImagePlaceholder
                name="dyocar desk command center"
                alt="Dyocar internal dispatch command center dashboard"
                caption="Internal Command Center: Real-time SLA timers, automated KYC skip triage, and one-click car class swaps."
                badge="Internal Ops Tool: Real-Time Triage Desk"
                aspectRatio="16 / 10"
                fallbackType="hifi-1"
                src="/Screens/1400/dyocar-1.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "24%",
                    y: "28%",
                    tag: "SLA Queue Triage",
                    title: "11m / 15m Threshold Warning",
                    text: "Flags bookings nearing the 15-minute customer SLA threshold to prevent cancellations.",
                  },
                  {
                    id: 2,
                    x: "82%",
                    y: "26%",
                    tag: "Async Verification",
                    title: "DigiLocker KYC Skip Recovery",
                    text: "Allows customers to complete checkout first, then automatically sends a tokenized WhatsApp verification link.",
                  },
                  {
                    id: 3,
                    x: "78%",
                    y: "71%",
                    tag: "Inventory Swaps",
                    title: "1-Click Same-Class Vehicle Swap",
                    text: "Enables instant car substitution within the same hub without voiding the booking contract.",
                  },
                  {
                    id: 4,
                    x: "56%",
                    y: "43%",
                    tag: "Contextual Tags",
                    title: "Operational Micro-State Indicators",
                    text: "Unambiguous visual tokens distinguish between SLOT_STALE, HUB_DOWN, First Trip, and Add-on Out.",
                  },
                ]}
              />
            </div>

            <p className="lp-strategy__paragraph cs-body">
              We stopped treating operations as an administrative back-office and redesigned the
              triage center like a high-frequency trading terminal: dense, keyboard-friendly, with
              immediate single-click recovery workflows.
            </p>
          </div>

          {/* Right Column: Col-Span 5 - Highlight Card */}
          <div className="lp-col-5 col-span-5 lp-strategy__right">
            <div className="lp-highlight-card">
              <p className="lp-highlight-card__body cs-body">
                If the desk team takes 40 minutes to review a driver's license and assign a car,
                no amount of smooth consumer animations will fix the user's anxiety.
              </p>

              {/* Callout Highlight Box */}
              <div className="lp-callout-box">
                <span className="lp-callout-box__quotemark">“</span>
                <p className="lp-callout-box__quote">
                  We stopped optimizing the checkout form and started optimizing the time-to-guarantee.
                </p>
              </div>

              {/* Verdict Box */}
              <div className="lp-verdict-box">
                <div className="lp-verdict-box__indicator" />
                <p className="lp-verdict-box__text cs-body">
                  By decoupling vehicle reservation from document verification, we allowed users
                  to lock their preferred car in seconds. Government DigiLocker and driving license
                  audits ran asynchronously in parallel, driving the average confirmation SLA down
                  from 45 minutes to under 4 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 4: CONSUMER DISCOVERY & WALK-IN INCENTIVES
          2-Column Grid (12 cols: 4 left / 8 right)
         ======================================================== */}
      <section className="lp-section lp-section--solution" id="section-discovery">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 4 - Principles */}
          <div className="lp-col-4 col-span-4 lp-solution__left">
            <h2 className="lp-solution__headline cs-h2">
              Incentivizing the Walk-in Hub
            </h2>

            <p className="lp-solution__desc cs-body">
              In Bengaluru traffic, doorstep vehicle delivery often incurs 60–90 minute road delays
              and high logistics costs. Rather than forcing expensive delivery, we gave users
              clear transparent agency: pick up at a nearby hub to save money, or choose doorstep
              delivery at a scheduled time.
            </p>

            {/* Key Takeaway Box */}
            <div className="lp-takeaway-card">
              <div className="lp-takeaway-card__header">
                <span className="lp-takeaway-card__icon">📍</span>
                <span className="lp-takeaway-card__label cs-code2">Incentive Architecture</span>
              </div>
              <p className="lp-takeaway-card__text cs-body">
                Displaying upfront walk-in discounts (e.g. "Save ₹32") shifted 41% of demand to
                self-pickup hubs, cutting fleet transit overhead while giving users instant car access.
              </p>
            </div>
          </div>

          {/* Right Column: Col-Span 8 - Showcase */}
          <div className="lp-col-8 col-span-8 lp-solution__right">
            <div className="lp-showcase-frame">
              <ImagePlaceholder
                name="consumer discovery and map hub"
                alt="Dyocar consumer mobile app discovery and walk-in hub map selection"
                caption="Consumer Discovery Flow: Location presets, interactive walk-in hub map with distance indicators, and upfront savings."
                badge="Consumer Mobile App: Hub Discovery"
                aspectRatio="16 / 10"
                fallbackType="hifi-1"
                src="/Screens/1400/dyocar-2.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "22%",
                    y: "32%",
                    tag: "Quick Search",
                    title: "One-Tap Location & Date Selector",
                    text: "Streamlined search inputs with instant transit presets (Majestic, Airport, Tech Parks).",
                  },
                  {
                    id: 2,
                    x: "82%",
                    y: "64%",
                    tag: "Walk-in Incentive",
                    title: "Proximity & Upfront Savings",
                    text: "Highlights nearest walkable hub (1.1 km) with transparent savings over delivery.",
                  },
                  {
                    id: 3,
                    x: "22%",
                    y: "56%",
                    tag: "Urgency Indicators",
                    title: "Live Inventory Micro-Badge",
                    text: "'Only 1 left' chip communicates scarcity without aggressive dark patterns.",
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
          SECTION 5: FLEET BROWSING & THE DOORSTEP TOGGLE
          2-Column Grid (12 cols: 8 left / 4 right)
         ======================================================== */}
      <section className="lp-section lp-section--fleet" id="section-fleet">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 8 - Showcase */}
          <div className="lp-col-8 col-span-8 lp-solution__right">
            <div className="lp-showcase-frame">
              <ImagePlaceholder
                name="fleet catalog and vehicle detail"
                alt="Dyocar fleet catalog, filter sheet, and vehicle detail page"
                caption="Fleet Browsing: Multi-attribute vehicle filtering, all-inclusive hourly rates, and the 1-tap doorstep delivery toggle."
                badge="Consumer App: Catalog & Vehicle Detail"
                aspectRatio="16 / 10"
                fallbackType="hifi-2"
                src="/Screens/1400/dyocar-3.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "24%",
                    y: "52%",
                    tag: "Transparent Pricing",
                    title: "All-Inclusive Hourly Rates",
                    text: "Clear rate structure (₹820/hr) with transparent fee breakdown and no surprise fuel penalties.",
                  },
                  {
                    id: 2,
                    x: "52%",
                    y: "56%",
                    tag: "Faceted Search",
                    title: "Instant Spec Filtering",
                    text: "Filter by transmission (Auto/Manual), fuel type (EV/ICE), and features (Sunroof, GPS).",
                  },
                  {
                    id: 3,
                    x: "82%",
                    y: "72%",
                    tag: "Fulfillment Switch",
                    title: "Want Your Car Brought to You?",
                    text: "Contextual toggle right above the checkout button lets users switch fulfillment in one tap.",
                  },
                ]}
              />
            </div>
          </div>

          {/* Right Column: Col-Span 4 - Narrative */}
          <div className="lp-col-4 col-span-4 lp-solution__left">
            <h2 className="lp-solution__headline cs-h2">
              Clarity over complexity
            </h2>

            <p className="lp-solution__desc cs-body">
              Car rental apps routinely overwhelm users with endless damage liability tiers, hidden
              cleaning deposits, and confusing fuel policies. We stripped the UI down to the core
              factors drivers actually care about: transmission, vehicle clearance, clean cabin,
              and upfront hourly cost.
            </p>

            <div className="lp-takeaway-card">
              <div className="lp-takeaway-card__header">
                <span className="lp-takeaway-card__icon">⚡</span>
                <span className="lp-takeaway-card__label cs-code2">Design Tenet</span>
              </div>
              <p className="lp-takeaway-card__text cs-body">
                Keep the booking path light. Every ancillary decision before payment lowers conversion;
                defer customization to the post-booking grace window.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 6: EDGE CASES & THE "PREP-LOCK" WINDOW
          2-Column Balanced Modular Grid (grid-cols-2 / 6 cols each)
         ======================================================== */}
      <section className="lp-section lp-section--edge-cases" id="section-edge-cases">
        <div className="lp-section__container lp-grid-balanced grid-cols-2">
          {/* Left Card: Interactive Prep-Lock Widget */}
          <div className="lp-card lp-card--modular lp-edge-card">
            <h2 className="lp-card__headline cs-h2">
              Personalization without checkout friction
            </h2>

            <p className="lp-card__text cs-body">
              Riders frequently requested specialized in-cabin amenities (dashcam, child safety
              seats, fresh aroma, highway snacks). But presenting these during checkout caused
              decision fatigue. We introduced the <strong>Prep-Lock Window</strong>: riders can modify
              in-cabin add-ons after booking, right until the hub staff locks vehicle prep.
            </p>

            {/* Interactive Add-ons Simulator */}
            <div className="dy-prep-widget">
              <div className="dy-prep-widget__header">
                <div className="dy-prep-widget__status">
                  <span className="dy-status-dot dy-status-dot--live" />
                  <span className="cs-code2">Prep-Lock Window: 14m 28s remaining</span>
                </div>
                <span className="dy-prep-widget__badge cs-code2">Live Interactive Preview</span>
              </div>

              <div className="dy-prep-widget__items">
                <button
                  type="button"
                  className={`dy-addon-chip ${selectedAddons.scent ? "is-selected" : ""}`}
                  onClick={() => toggleAddon("scent")}
                >
                  <span className="dy-addon-chip__check">{selectedAddons.scent ? "✓" : "+"}</span>
                  <span className="dy-addon-chip__title">Air Freshener (Fresh Pine)</span>
                  <span className="dy-addon-chip__price">Free</span>
                </button>

                <button
                  type="button"
                  className={`dy-addon-chip ${selectedAddons.snacks ? "is-selected" : ""}`}
                  onClick={() => toggleAddon("snacks")}
                >
                  <span className="dy-addon-chip__check">{selectedAddons.snacks ? "✓" : "+"}</span>
                  <span className="dy-addon-chip__title">Highway Snack & Water Box</span>
                  <span className="dy-addon-chip__price">+₹280</span>
                </button>

                <button
                  type="button"
                  className={`dy-addon-chip ${selectedAddons.babySeat ? "is-selected" : ""}`}
                  onClick={() => toggleAddon("babySeat")}
                >
                  <span className="dy-addon-chip__check">{selectedAddons.babySeat ? "✓" : "+"}</span>
                  <span className="dy-addon-chip__title">Isofix Child Safety Seat</span>
                  <span className="dy-addon-chip__price">+₹450</span>
                </button>

                <button
                  type="button"
                  className={`dy-addon-chip ${selectedAddons.delivery ? "is-selected" : ""}`}
                  onClick={() => toggleAddon("delivery")}
                >
                  <span className="dy-addon-chip__check">{selectedAddons.delivery ? "✓" : "+"}</span>
                  <span className="dy-addon-chip__title">Doorstep Home Delivery</span>
                  <span className="dy-addon-chip__price">+₹320</span>
                </button>
              </div>

              <div className="dy-prep-widget__footer">
                <div className="dy-prep-widget__calc">
                  <span className="cs-code2">Rental + Selected Comforts</span>
                  <span className="dy-prep-widget__amount">₹{calculatedTotal.toLocaleString("en-IN")}</span>
                </div>
                <button
                  type="button"
                  className="lp-alert-preview__btn lp-alert-preview__btn--primary"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? "✓ Token Copied" : "Copy Direct DigiLocker Link"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Post-Booking Reassurance & Screenshot */}
          <div className="lp-card lp-card--modular lp-edge-card">
            <div className="lp-edge-narrative">
              <p className="lp-card__text cs-body">
                Instead of a sterile "Payment Success" receipt, the post-booking experience provides
                an active, reassuring timeline: payment received, booking review in progress,
                and delivery schedule. WhatsApp notifications keep the customer informed without
                requiring them to keep the app open.
              </p>
            </div>

            {/* Media: Dyocar-5.jpg */}
            <div className="lp-edge-media">
              <ImagePlaceholder
                name="addons checkout and status confirmation"
                alt="Dyocar add-ons customization, UPI checkout, and post-booking status timeline"
                caption="Checkout & Reassurance: Optional trip add-ons, transparent UPI billing, and live post-booking status timeline."
                badge="Checkout & Post-Booking Status"
                aspectRatio="16 / 10"
                fallbackType="hifi-2"
                src="/Screens/1400/dyocar-5.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "24%",
                    y: "28%",
                    tag: "Cabin Comfort",
                    title: "Zero-Friction Add-Ons",
                    text: "Free essentials (air freshener, ashtray) paired with paid upgrades (snacks, baby seats).",
                  },
                  {
                    id: 2,
                    x: "52%",
                    y: "48%",
                    tag: "Frictionless Pay",
                    title: "UPI Direct Integration",
                    text: "Google Pay, PhonePe, and Paytm auto-detection for 1-tap checkout.",
                  },
                  {
                    id: 3,
                    x: "82%",
                    y: "44%",
                    tag: "Active Timeline",
                    title: "Reassuring Status Journey",
                    text: "Live milestone tracking with guaranteed 10–15 min WhatsApp confirmation SLA.",
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
          SECTION 7: DESIGN SYSTEM & OPERATIONAL TOKENS
          2-Column Asymmetric Grid (12 cols: 5 left / 7 right)
         ======================================================== */}
      <section className="lp-section lp-section--design-system" id="section-design-system">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 5 */}
          <div className="lp-col-5 col-span-5 lp-strategy__right">
            <h2 className="lp-strategy__headline cs-h2">
              A Design System Built for High-Stress Ops
            </h2>

            <p className="lp-strategy__paragraph cs-body">
              Hub operations are loud, high-pressure environments. Dispatchers manage phone calls,
              walk-in customers, and vehicle turnaround simultaneously. Every UI token in the
              design system was engineered for immediate visual disambiguation.
            </p>

            <div className="dy-tokens-summary">
              <div className="dy-token-row">
                <span className="dy-token-badge dy-token-badge--green">Emerald Green</span>
                <span className="cs-body">Validated states: Handover complete, vehicle ready</span>
              </div>
              <div className="dy-token-row">
                <span className="dy-token-badge dy-token-badge--amber">Amber Alert</span>
                <span className="cs-body">SLA risks, pending KYC, &lt; 2h prep window</span>
              </div>
              <div className="dy-token-row">
                <span className="dy-token-badge dy-token-badge--red">Crimson Warning</span>
                <span className="cs-body">SLA breach, payment failure, hub offline</span>
              </div>
            </div>
          </div>

          {/* Right Column: Col-Span 7 - Screenshot 4 */}
          <div className="lp-col-7 col-span-7 lp-strategy__left">
            <div className="lp-strategy__media-wrap">
              <ImagePlaceholder
                name="dyocar component library design system"
                alt="Dyocar design system component library showing buttons, chips, alerts, and counters"
                caption="Operational Design System: High-contrast buttons, status chips, multi-payment rails, and urgency alert banners."
                badge="Design System: Operational Tokens"
                aspectRatio="16 / 10"
                fallbackType="wireframe"
                src="/Screens/1400/dyocar-4.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "24%",
                    y: "14%",
                    tag: "Action Hierarchy",
                    title: "Distinct Button States",
                    text: "Filled emerald for confirmations, neutral dark for routine tasks, high-visibility red for rejections.",
                  },
                  {
                    id: 2,
                    x: "30%",
                    y: "48%",
                    tag: "Alert Semantics",
                    title: "High-Contrast Alert Banners",
                    text: "Contextual banners for KYC verification, inspector arrival, and prep locks.",
                  },
                  {
                    id: 3,
                    x: "30%",
                    y: "74%",
                    tag: "Telemetry",
                    title: "Live Stat Cards",
                    text: "Real-time counters for fleet status, verifying queues, and late trips.",
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
          SECTION 8: IMPACT & OUTCOMES
          3-Column Stats & Closing Card (grid-cols-12: 4 / 4 / 4)
         ======================================================== */}
      <section className="lp-section lp-section--impact" id="section-impact">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Section Heading: Numbers */}
          <div className="lp-col-12 col-span-12 lp-impact__header">
            <h2 className="lp-impact__title">
              Impact by the numbers
            </h2>
          </div>

          {/* Stat Card 1: Confirmation SLA */}
          <div className="lp-col-4 col-span-4 lp-stat-card">
            <div className="lp-stat-card__inner">
              <div className="lp-stat-card__metric dy-stat-metric--green">
                3.2 min
              </div>
              <p className="lp-stat-card__label cs-body">
                Average booking confirmation SLA, down from 45+ minutes of manual coordination.
              </p>
              <div className="lp-stat-card__footer cs-code2">
                <span className="lp-stat-card__pill dy-pill--green">Sub-5m SLA</span>
                <span>99.4% On-Time Dispatch</span>
              </div>
            </div>
          </div>

          {/* Stat Card 2: Verification Dropoff */}
          <div className="lp-col-4 col-span-4 lp-stat-card">
            <div className="lp-stat-card__inner">
              <div className="lp-stat-card__metric lp-stat-card__metric--white">
                –46%
              </div>
              <p className="lp-stat-card__label cs-body">
                Reduction in KYC verification churn via asynchronous DigiLocker fallback queues.
              </p>
              <div className="lp-stat-card__footer cs-code2">
                <span className="lp-stat-card__pill dy-pill--green">Async Verification</span>
                <span>Zero Blocked Bookings</span>
              </div>
            </div>
          </div>

          {/* Closing Narrative Card */}
          <div className="lp-col-4 col-span-4 lp-closing-card">
            <div className="lp-closing-card__inner">
              <h3 className="lp-closing-card__headline cs-h3">
                Designing Trust at Scale
              </h3>

              <p className="lp-closing-card__desc cs-body">
                By designing the dispatch command center with the same craft and rigor as the
                consumer mobile app, Dyocar turned fulfillment from an operational hazard into
                a core retention engine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: LEARNINGS
          2-Column Layout (7 cols left text / 5 cols right lego diorama)
         ======================================================== */}
      <section className="lp-section lp-section--learnings" id="section-learnings">
        <div className="lp-section__container lp-grid-12 grid-cols-12 lp-learnings__container">
          {/* Left Column: Headline + Bullet List */}
          <div className="lp-col-7 col-span-7 lp-learnings__left">
            <h2 className="lp-learnings__title">
              Learnings from 0→1
            </h2>

            <ul className="lp-learnings__list">
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet dy-bullet--green" aria-hidden="true" />
                <p className="lp-learnings__text">
                  <strong>Internal tools directly drive customer experience:</strong> If an operator's
                  interface is slow or fragmented, the end customer inevitably feels the delay.
                </p>
              </li>
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet dy-bullet--green" aria-hidden="true" />
                <p className="lp-learnings__text">
                  <strong>Never block user intent on external APIs:</strong> Third-party government
                  verification services will fail. Lock the vehicle first, verify asynchronously second.
                </p>
              </li>
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet dy-bullet--green" aria-hidden="true" />
                <p className="lp-learnings__text">
                  <strong>Post-booking windows increase basket size:</strong> Riders are far more
                  receptive to customizing their vehicle comfort once they have the peace of mind that their car is secured.
                </p>
              </li>
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet dy-bullet--green" aria-hidden="true" />
                <p className="lp-learnings__text">
                  <strong>Transparent incentives shape real-world behavior:</strong> A modest walk-in
                  discount shifted 41% of demand to neighborhood hubs, slashing last-mile transit overhead.
                </p>
              </li>
            </ul>
          </div>

          {/* Right Column: Lego Minifigure Diorama */}
          <div className="lp-col-5 col-span-5 lp-learnings__right">
            <div className="lp-learnings__media-wrap">
              <img
                src="/case-studies/dyocar/lego-learnings.jpg"
                alt="Lego designer and engineer minifigure examining vehicle blueprints at illuminated workbench"
                className="lp-learnings__lego-img"
                width={640}
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
