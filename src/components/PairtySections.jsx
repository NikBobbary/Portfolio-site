import { useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder.jsx";

/**
 * PairtySections: Complete Dark-Mode UX Case Study layout for Pairty
 * 
 * Includes:
 * - Section 1: Intro (Human Capital Liquidity & Exclusive Networking)
 * - Section 2: The Core Problem: The Noise & Asymmetry Crisis
 * - Section 3: The Strategic Shift: Architecture of Skin in the Game
 * - Section 4: Eliminating Imposters at the Gate (Two-Tier Verification & Trust Gating)
 * - Section 5: Curated Discovery & The Metallic VIP Credential
 * - Section 6: The Escrow Consultation Model & Interactive Simulator
 * - Section 7: Tokenomics & Dual-Rail Architecture (PTY Tokens)
 * - Section 8: Impact & Outcomes by the Numbers
 * - Section 9: Key Learnings from 0→1
 */
export default function PairtySections() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [consultationFee, setConsultationFee] = useState(120);
  const [messageStep, setMessageStep] = useState(1);
  const [refundSimulated, setRefundSimulated] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText("https://pairty.com/invite/vip-network?ref=pty-2024-8821");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  const advanceStep = () => {
    setRefundSimulated(false);
    setMessageStep((prev) => (prev < 4 ? prev + 1 : 4));
  };

  const simulateRefund = () => {
    setRefundSimulated(true);
  };

  const resetSimulator = () => {
    setMessageStep(1);
    setRefundSimulated(false);
  };

  const exchangeStages = [
    {
      step: 1,
      sender: "Founder (Initiator)",
      title: "Context & Strategic Problem Statement",
      preview: "Locked $120 in escrow. Outlined unit economics & ask for enterprise GTM strategy.",
    },
    {
      step: 2,
      sender: "Advisor (Operator)",
      title: "Diagnostic Analysis & Counter-Questions",
      preview: "Advisor reviewed pitch deck, identified contract pricing bottleneck, and suggested pricing rework.",
    },
    {
      step: 3,
      sender: "Founder (Initiator)",
      title: "Clarifications & Funnel Validation",
      preview: "Submitted revised pipeline numbers and requested introduction to Tier-1 pilot partners.",
    },
    {
      step: 4,
      sender: "Advisor (Operator)",
      title: "Actionable Execution Blueprint & Wrap-up",
      preview: "Delivered pilot intro template and warm intros. 4-message exchange condition completed!",
    },
  ];

  return (
    <div className="lp-case-study py-case-study">
      {/* —— Section 1: Intro (Pairty: Human Capital Liquidity) —— */}
      <section className="lp-section lp-section--intro">
        <div className="lp-section--intro__container">
          {/* 3 columns: Bust Sticker */}
          <div className="lp-section--intro__sticker">
            <img
              src="/case-studies/pairty/bust-sticker.jpg"
              alt="Classical statue bust with sleek modern VIP badge and sunglasses sticker"
              className="lp-sticker-bust py-bust-sticker"
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
                Human capital liquidity &amp; high-trust networking
              </h2>
              <p className="lp-section--intro__desc cs-body">
                Pairty is an exclusive networking and advisory platform designed in partnership
                with Focusoft HQ to eliminate the noise of cold outreach. By pairing strict identity
                verification with escrow-backed consultations, Pairty gives founders direct access
                to vetted operators while respecting advisor time.
              </p>
              <ul className="lp-section--intro__bullets cs-body">
                <li>Two-tier KYC gating (Phone OTP + Passport/DL biometric audit)</li>
                <li>Escrow-backed consultations with guaranteed 4-message exchange reciprocity</li>
                <li>Dual-rail liquidity (Instant fiat checkout + native PTY token micro-transactions)</li>
              </ul>
            </div>

            {/* 2 columns: Logo */}
            <div className="lp-section--intro__logo-wrap">
              <img
                src="/case-studies/pairty/pairty-logo.svg"
                alt="Pairty logo"
                className="py-logo-badge"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer lp-section-spacer--intro" aria-hidden="true" />

      {/* —— Section 2: Problem: The Trust & Asymmetry Crisis —— */}
      <section className="lp-section lp-section--problem">
        <div className="lp-section--problem__container">
          <div className="lp-section--problem__left">
            <h2 className="lp-section--problem__title cs-h1">
              The trust &amp;
              <br />
              asymmetry crisis
            </h2>
            <div className="lp-section--problem__seesaw-wrap">
              <img
                src="/case-studies/pairty/lego-barrier.jpg"
                alt="Lego diorama of a founder with unanswered notifications separated by a glass divide from an executive holding an exclusive access card"
                className="lp-lego-seesaw py-lego-img"
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
                Cold outreach is broken. <em>High-stakes advice cannot survive in open inboxes.</em>
              </h3>
              <p className="cs-body">
                On open platforms like LinkedIn or Twitter, inbound inboxes are a cacophony of bots,
                unsolicited sales pitches, and unvetted solicitations. Seasoned operators retreat into
                private group chats, while ambitious founders are forced to play an exhausting
                numbers game where 9 out of 10 messages go unanswered.
              </p>
            </div>

            <div className="lp-section--problem__relay">
              <h3 className="lp-section--problem__relay-title cs-h3">
                Where professional networking fractures
              </h3>
              <div className="lp-section--problem__relay-grid">
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    <strong>1. Zero Skin in the Game</strong>
                    <br />
                    Because sending 500 LinkedIn InMails costs almost nothing, inboxes are inundated
                    with low-effort copy-pasted pitches that drown out genuine founder talent.
                  </p>
                </div>
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    <strong>2. Uncompensated Cognitive Load</strong>
                    <br />
                    High-value advisors are routinely asked to &ldquo;pick your brain for 15 minutes,&rdquo;
                    creating an uncompensated drain with zero structural incentive to respond.
                  </p>
                </div>
                <div className="lp-section--problem__relay-col">
                  <p className="cs-body">
                    <strong>3. Ghosting &amp; Asymmetric Risk</strong>
                    <br />
                    When users attempt paid consultations off-platform, founders fear getting ghosted
                    after paying, while advisors fear endless unpaid scope creep.
                  </p>
                </div>
              </div>
            </div>

            <div className="lp-section--problem__stat-row">
              <div className="lp-section--problem__stat-content">
                <div className="lp-section--problem__stat-headline">
                  <span className="lp-problem-stat-num py-problem-stat-num">~88%</span>
                  <span className="lp-problem-stat-suffix">cold messages ignored or unread</span>
                </div>
                <p className="lp-section--problem__stat-desc cs-body">
                  Across standard enterprise networking channels, response rates on cold outreach
                  hover under 12%, producing massive friction and wasted capital across the venture ecosystem.
                </p>
              </div>

              <div className="lp-section--problem__stat-sticker">
                <img
                  src="/case-studies/pairty/trust-shield.svg"
                  alt="Pairty 4-Message Escrow Guarantee Badge"
                  className="lp-exclamation-sticker py-trust-shield"
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
          SECTION 3: THE STRATEGIC SHIFT (ARCHITECTURE OF SKIN IN THE GAME)
          2-Column Asymmetrical Grid (12 cols: 7 left / 5 right)
         ======================================================== */}
      <section className="lp-section lp-section--strategy" id="section-strategy">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 7 */}
          <div className="lp-col-7 col-span-7 lp-strategy__left">
            <h2 className="lp-strategy__headline cs-h2">
              Engineering Skin in the Game
            </h2>

            <p className="lp-strategy__paragraph cs-body">
              Instead of designing another superficial swipe feed, we treated professional access
              like a financial clearinghouse. We architected a closed-loop system where discovery
              is curated, identity is non-negotiable, and advisory consultations are governed by
              programmatic escrow contracts.
            </p>

            {/* Image Container: System Architecture Flow */}
            <div className="lp-strategy__media-wrap">
              <ImagePlaceholder
                name="pairty system user flow architecture"
                alt="Pairty end-to-end user flow architecture showing verification, matching, messaging, and token payment rails"
                caption="System Architecture: User journey mapping from biometric KYC gating, connection triage, and escrow messaging to PTY token balance redemption."
                badge="Platform Architecture: Complete System Flow"
                aspectRatio="16 / 10"
                fallbackType="wireframe"
                src="/Screens/1400/Pairty-3.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "24%",
                    y: "32%",
                    tag: "Trust Gate",
                    title: "Two-Tier Verification Gate",
                    text: "Mandatory phone verification + optional verified detail tiers before users can initiate outbound consultations.",
                  },
                  {
                    id: 2,
                    x: "54%",
                    y: "28%",
                    tag: "Escrow Protocol",
                    title: "Consultation Escrow Lock",
                    text: "Locks advisor fee ($120) upon message dispatch; funds are held in reserve until 4-message exchange completes.",
                  },
                  {
                    id: 3,
                    x: "82%",
                    y: "40%",
                    tag: "PTY Liquidity",
                    title: "Dual-Rail Token Dashboard",
                    text: "Enables instant micro-tipping, token top-ups, and automated redemption into connected bank accounts.",
                  },
                  {
                    id: 4,
                    x: "24%",
                    y: "76%",
                    tag: "Bilateral Controls",
                    title: "Mutual Connection vs Paid Inbound",
                    text: "Separates organic mutual matches from one-way paid priority consultations to prevent spam.",
                  },
                ]}
              />
            </div>

            <p className="lp-strategy__paragraph cs-body">
              By embedding financial reciprocity directly into the communication protocol, we
              transformed unsolicited inbound messages into high-signal, high-commitment advisory sessions.
            </p>
          </div>

          {/* Right Column: Col-Span 5 - Highlight Card */}
          <div className="lp-col-5 col-span-5 lp-strategy__right">
            <div className="lp-highlight-card">
              <p className="lp-highlight-card__body cs-body">
                If sending a message carries zero cost, inboxes will naturally devolve into spam.
                Conversely, if reaching out requires skin in the game, only the most motivated,
                well-prepared founders will initiate contact.
              </p>

              {/* Callout Highlight Box */}
              <div className="lp-callout-box py-callout-box">
                <span className="lp-callout-box__quotemark">“</span>
                <p className="lp-callout-box__quote">
                  When access carries verifiable skin in the game and a guaranteed standard of delivery, ghosting drops to zero.
                </p>
              </div>

              {/* Verdict Box */}
              <div className="lp-verdict-box py-verdict-box">
                <div className="lp-verdict-box__indicator py-verdict-indicator" />
                <p className="lp-verdict-box__text cs-body">
                  By introducing the <strong>4-Message Reciprocity Contract</strong>, we gave both
                  parties complete psychological safety: founders know their funds will auto-refund
                  if the advisor doesn&rsquo;t deliver, while advisors are fairly compensated for
                  their intellectual capital without commitment dread.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 4: VERIFIED IDENTITY SYSTEM & TRUST GATING (KYC)
          2-Column Grid (12 cols: 4 left / 8 right)
         ======================================================== */}
      <section className="lp-section lp-section--solution" id="section-identity">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 4 - Principles */}
          <div className="lp-col-4 col-span-4 lp-solution__left">
            <h2 className="lp-solution__headline cs-h2">
              Eliminating Imposters at the Gate
            </h2>

            <p className="lp-solution__desc cs-body">
              Prestige cannot be maintained if bad actors can spin up burner profiles. We engineered
              a progressive identity verification funnel that balances seamless onboarding with
              institutional-grade compliance.
            </p>

            {/* Key Takeaway Box */}
            <div className="lp-takeaway-card py-takeaway-card">
              <div className="lp-takeaway-card__header">
                <span className="lp-takeaway-card__icon">🛡️</span>
                <span className="lp-takeaway-card__label cs-code2">Identity Architecture</span>
              </div>
              <p className="lp-takeaway-card__text cs-body">
                Two-tier verification (SMS OTP + Driving License/Passport audit) filtered out 99.2%
                of fraudulent accounts while preserving an 86% onboarding completion rate among
                target tech executives and founders.
              </p>
            </div>
          </div>

          {/* Right Column: Col-Span 8 - Showcase */}
          <div className="lp-col-8 col-span-8 lp-solution__right">
            <div className="lp-showcase-frame">
              <ImagePlaceholder
                name="pairty verification and kyc gate"
                alt="Pairty phone authentication, SMS OTP input, and government ID face verification flow"
                caption="Two-Tier Onboarding: Global phone carrier verification, 6-digit numeric OTP keypad, and biometric document scanning (Passport & Driving License)."
                badge="Identity Security: Multi-Tier KYC Engine"
                aspectRatio="16 / 10"
                fallbackType="hifi-1"
                src="/Screens/1400/Pairty-2.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "18%",
                    y: "48%",
                    tag: "Global Auth",
                    title: "International Carrier Detection",
                    text: "Auto-detects country codes (+1 US, +44 UK, +971 UAE, +380 Ukraine) with carrier-level spam blacklisting.",
                  },
                  {
                    id: 2,
                    x: "50%",
                    y: "52%",
                    tag: "Hardware Ergonomics",
                    title: "Large-Format OTP Entry",
                    text: "Tactile auto-advancing 6-digit PIN boxes with dedicated dark-mode numeric keypad for single-handed mobile entry.",
                  },
                  {
                    id: 3,
                    x: "82%",
                    y: "48%",
                    tag: "Biometric KYC",
                    title: "Multi-Document Verification",
                    text: "Secure upload portal supporting Passport and Driving License OCR to verify legal identity before matching.",
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
          SECTION 5: CURATED DISCOVERY & THE METALLIC VIP CREDENTIAL
          2-Column Grid (12 cols: 8 left / 4 right)
         ======================================================== */}
      <section className="lp-section lp-section--discovery" id="section-discovery">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 8 - Showcase */}
          <div className="lp-col-8 col-span-8 lp-solution__right">
            <div className="lp-showcase-frame">
              <ImagePlaceholder
                name="pairty discovery and member credentials"
                alt="Pairty profile discovery card, pairing match celebration, gold metallic membership card, and paid consultation initiation modal"
                caption="Discovery & GTM Mechanics: Rich profile card discovery, bilateral pairing state, personalized gold metallic membership card, and paid chat initiation."
                badge="Core Product Experience: Discovery to Consultation"
                aspectRatio="16 / 10"
                fallbackType="hifi-2"
                src="/Screens/1400/Pairty-1.jpg"
                annotations={[
                  {
                    id: 1,
                    x: "14%",
                    y: "55%",
                    tag: "Contextual Depth",
                    title: "Curated Operator Profile",
                    text: "Displays verified location, expertise tags, and reciprocal mutuals without overwhelming social clutter.",
                  },
                  {
                    id: 2,
                    x: "38%",
                    y: "65%",
                    tag: "Mutual Pairing",
                    title: "Bilateral Match Affirmation",
                    text: "Celebrates mutual interest when both parties swipe right, unlocking zero-cost introductory networking.",
                  },
                  {
                    id: 3,
                    x: "62%",
                    y: "50%",
                    tag: "Social Proof",
                    title: "Tactile Gold Member Card",
                    text: "Generates a bespoke metallic member card with fine geometric linework to symbolize verified network prestige.",
                  },
                  {
                    id: 4,
                    x: "86%",
                    y: "46%",
                    tag: "Paid Gate",
                    title: "Consultation Fee Initiation",
                    text: "Transparent upfront fee ($120) with explicit 24h auto-refund guarantee and 4-message exchange terms.",
                  },
                ]}
              />
            </div>
          </div>

          {/* Right Column: Col-Span 4 - Narrative */}
          <div className="lp-col-4 col-span-4 lp-solution__left">
            <h2 className="lp-solution__headline cs-h2">
              Prestige, agency, and clarity
            </h2>

            <p className="lp-solution__desc cs-body">
              Pairty blends the frictionless speed of mobile gesture interactions with the tactile
              elegance of a private member&rsquo;s club. Instead of generic text lists, every profile
              is framed with high-fidelity visual hierarchy, verified pedigree badges, and clear
              engagement parameters.
            </p>

            <div className="lp-takeaway-card py-takeaway-card">
              <div className="lp-takeaway-card__header">
                <span className="lp-takeaway-card__icon">💎</span>
                <span className="lp-takeaway-card__label cs-code2">Design Tenet</span>
              </div>
              <p className="lp-takeaway-card__text cs-body">
                The gold metallic membership card is more than an aesthetic asset. It serves as a
                cryptographic anchor of identity and mutual respect, reminding members that access
                in Pairty is earned and protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 6: ESCROW CONSULTATION & INTERACTIVE SIMULATOR
          2-Column Balanced Modular Grid (grid-cols-2 / 6 cols each)
         ======================================================== */}
      <section className="lp-section lp-section--edge-cases" id="section-escrow">
        <div className="lp-section__container lp-grid-balanced grid-cols-2">
          {/* Left Card: Interactive Escrow Simulator */}
          <div className="lp-card lp-card--modular lp-edge-card">
            <h2 className="lp-card__headline cs-h2">
              The 4-Message Reciprocity Simulator
            </h2>

            <p className="lp-card__text cs-body">
              How does Pairty prevent bad-faith behavior in paid chats? Test the interactive protocol:
              select a consultation rate, review the escrow hold, and simulate advancing through
              the 4 message exchanges that unlock funds to the advisor.
            </p>

            {/* Interactive Widget */}
            <div className="py-escrow-widget">
              <div className="py-escrow-widget__header">
                <div className="py-escrow-widget__status">
                  <span
                    className={`py-status-dot ${
                      messageStep === 4
                        ? "py-status-dot--completed"
                        : refundSimulated
                        ? "py-status-dot--refunded"
                        : "py-status-dot--live"
                    }`}
                  />
                  <span className="cs-code2">
                    {messageStep === 4
                      ? "Escrow Fulfilled · Funds Released"
                      : refundSimulated
                      ? "24h SLA Expired · 100% Refunded to Founder"
                      : "Escrow Holding Active · 24h Auto-Refund Protected"}
                  </span>
                </div>
                <span className="py-escrow-widget__badge cs-code2">Interactive Escrow Demo</span>
              </div>

              {/* Consultation Rate Picker */}
              <div className="py-rate-selector">
                <span className="py-rate-label cs-code2">Advisor Consultation Fee:</span>
                <div className="py-rate-buttons">
                  {[50, 120, 250].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      className={`py-rate-btn ${consultationFee === rate ? "is-selected" : ""}`}
                      onClick={() => setConsultationFee(rate)}
                    >
                      ${rate} USD <span className="py-rate-pty">({rate} PTY)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Progress Bar */}
              <div className="py-progress-container">
                <div className="py-progress-header">
                  <span className="cs-code2">
                    Exchange Progress: <strong>{refundSimulated ? "0" : messageStep} of 4 messages</strong>
                  </span>
                  <span className="py-progress-pct cs-code2">
                    {refundSimulated ? "Refunded" : `${messageStep * 25}%`}
                  </span>
                </div>
                <div className="py-progress-track">
                  <div
                    className={`py-progress-bar ${messageStep === 4 ? "is-complete" : ""}`}
                    style={{ width: refundSimulated ? "0%" : `${messageStep * 25}%` }}
                  />
                </div>
              </div>

              {/* Current Active Stage Description */}
              <div className="py-exchange-preview">
                {!refundSimulated ? (
                  <>
                    <div className="py-exchange-meta">
                      <span className="py-exchange-step-chip cs-code2">
                        Round {messageStep}
                      </span>
                      <span className="py-exchange-sender cs-code2">
                        {exchangeStages[messageStep - 1].sender}
                      </span>
                    </div>
                    <div className="py-exchange-title">
                      {exchangeStages[messageStep - 1].title}
                    </div>
                    <div className="py-exchange-desc cs-body">
                      {exchangeStages[messageStep - 1].preview}
                    </div>
                  </>
                ) : (
                  <div className="py-refund-box">
                    <span className="py-refund-icon">↩</span>
                    <div>
                      <strong>Escrow Cancelled &amp; Returned</strong>
                      <p className="cs-body">
                        Advisor did not respond within 24 hours. The ${consultationFee} fee was
                        instantly refunded to the founder&rsquo;s payment method.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Action Controls */}
              <div className="py-escrow-widget__footer">
                <div className="py-escrow-actions">
                  <button
                    type="button"
                    className="lp-alert-preview__btn lp-alert-preview__btn--primary py-advance-btn"
                    onClick={advanceStep}
                    disabled={messageStep === 4 && !refundSimulated}
                  >
                    {messageStep === 4 && !refundSimulated
                      ? "✓ All 4 Messages Completed"
                      : `Advance to Message #${messageStep + 1}`}
                  </button>
                  <button
                    type="button"
                    className="py-secondary-btn"
                    onClick={simulateRefund}
                  >
                    Simulate 24h Expiry
                  </button>
                  <button
                    type="button"
                    className="py-reset-btn"
                    onClick={resetSimulator}
                    title="Reset Simulator"
                  >
                    ↺ Reset
                  </button>
                </div>

                <div className="py-escrow-calc">
                  <span className="cs-code2">Current Escrow Vault</span>
                  <span className="py-escrow-amount">
                    {refundSimulated ? "$0.00" : `$${consultationFee}.00`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: The Reciprocity Architecture Narrative */}
          <div className="lp-card lp-card--modular lp-edge-card">
            <h2 className="lp-card__headline cs-h2">
              Why 4 Messages? Solving the Delivery Gap
            </h2>

            <div className="lp-edge-narrative">
              <p className="lp-card__text cs-body">
                Existing advisory marketplaces frequently collapse due to mismatched expectations.
                If an advisor receives money upfront and responds with a single-word reply like
                &ldquo;Thanks for reaching out,&rdquo; the paying founder feels robbed. If a platform
                mandates an open-ended dialogue, advisors get dragged into endless consulting without compensation.
              </p>
              <p className="lp-card__text cs-body">
                Pairty&rsquo;s <strong>4-Message Threshold</strong> was calibrated through user research
                with top founders and angels. It provides the exact structure needed for:
              </p>
              <ul className="py-reciprocity-list cs-body">
                <li>
                  <strong>1. Context Framing:</strong> Founder provides problem statement, metrics, and targeted question.
                </li>
                <li>
                  <strong>2. Diagnostic Insight:</strong> Advisor shares strategic perspective and challenges assumptions.
                </li>
                <li>
                  <strong>3. Clarification &amp; Data:</strong> Founder submits specifics to stress-test the advice.
                </li>
                <li>
                  <strong>4. Actionable Next Steps:</strong> Advisor delivers intro templates, tactical execution blueprint, and closing takeaways.
                </li>
              </ul>
              <div className="py-escrow-callout">
                <span className="py-escrow-callout__icon">⚖️</span>
                <p className="cs-body">
                  If 4 message exchanges are not completed within the session, or if the advisor
                  is unresponsive within 24 hours, the full fee is automatically refunded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Gap / Spacing between sections —— */}
      <div className="lp-section-spacer" aria-hidden="true" />

      {/* ========================================================
          SECTION 7: TOKENOMICS & DUAL-RAIL LIQUIDITY (PTY TOKENS)
          2-Column Asymmetric Grid (12 cols: 5 left / 7 right)
         ======================================================== */}
      <section className="lp-section lp-section--design-system" id="section-tokenomics">
        <div className="lp-section__container lp-grid-12 grid-cols-12">
          {/* Left Column: Col-Span 5 */}
          <div className="lp-col-5 col-span-5 lp-strategy__right">
            <h2 className="lp-strategy__headline cs-h2">
              Dual-Rail Payment Architecture
            </h2>

            <p className="lp-strategy__paragraph cs-body">
              Cross-border founders and international operators face punishing credit card interchange
              fees on small advisory messages. To solve this, Pairty pairs standard Stripe/Apple Pay
              fiat rails with native <strong>PTY Tokens</strong> for instantaneous, zero-overhead settlement.
            </p>

            <div className="py-tokens-summary">
              <div className="py-token-row">
                <span className="py-token-badge py-token-badge--blue">Fiat Direct</span>
                <span className="cs-body">Credit card &amp; Apple Pay direct checkout for one-off sessions</span>
              </div>
              <div className="py-token-row">
                <span className="py-token-badge py-token-badge--gold">PTY Balance</span>
                <span className="cs-body">Zero-gas, instant micro-tokens for tips, intros, and continuous chats</span>
              </div>
              <div className="py-token-row">
                <span className="py-token-badge py-token-badge--emerald">Automated Payout</span>
                <span className="cs-body">One-click advisor redemption to verified corporate bank accounts</span>
              </div>
            </div>
          </div>

          {/* Right Column: Col-Span 7 */}
          <div className="lp-col-7 col-span-7 lp-strategy__left">
            <div className="py-architecture-card">
              <h3 className="py-architecture-title cs-h3">
                Lifecycle of an Escrow Consultation
              </h3>

              <div className="py-lifecycle-grid">
                <div className="py-lifecycle-step">
                  <div className="py-step-number cs-code2">01</div>
                  <h4 className="py-step-heading">Intent &amp; Escrow Lock</h4>
                  <p className="cs-body">
                    Founder initiates chat. Fee is placed into an isolated smart escrow contract.
                    Advisor receives push notification with preview question.
                  </p>
                </div>

                <div className="py-lifecycle-step">
                  <div className="py-step-number cs-code2">02</div>
                  <h4 className="py-step-heading">24-Hour SLA Timer</h4>
                  <p className="cs-body">
                    Advisor has 24 hours to review and accept. If declined or unanswered, funds
                    auto-refund with zero penalty to founder.
                  </p>
                </div>

                <div className="py-lifecycle-step">
                  <div className="py-step-number cs-code2">03</div>
                  <h4 className="py-step-heading">4-Turn Conversation</h4>
                  <p className="cs-body">
                    In-app counter tracks mutual message deliveries. Rich embeds support pitch
                    decks, Figma links, and code snippets.
                  </p>
                </div>

                <div className="py-lifecycle-step py-lifecycle-step--highlight">
                  <div className="py-step-number cs-code2">04</div>
                  <h4 className="py-step-heading">Settlement &amp; Ratings</h4>
                  <p className="cs-body">
                    Upon 4th message delivery, escrow releases funds directly into advisor&rsquo;s PTY
                    balance. Both parties exchange private reputation marks.
                  </p>
                </div>
              </div>

              <div className="py-lifecycle-invite">
                <button
                  type="button"
                  className="lp-alert-preview__btn lp-alert-preview__btn--primary"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? "✓ Invite Link Copied to Clipboard" : "Copy Pairty VIP Member Invite"}
                </button>
              </div>
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
          {/* Section Heading */}
          <div className="lp-col-12 col-span-12 lp-impact__header">
            <h2 className="lp-impact__title">
              Impact by the numbers
            </h2>
          </div>

          {/* Stat Card 1: Response Rate */}
          <div className="lp-col-4 col-span-4 lp-stat-card">
            <div className="lp-stat-card__inner">
              <div className="lp-stat-card__metric py-stat-metric--blue">
                94%
              </div>
              <p className="lp-stat-card__label cs-body">
                Advisor response rate on paid consultations, compared to ~12% industry baseline on LinkedIn InMail.
              </p>
              <div className="lp-stat-card__footer cs-code2">
                <span className="lp-stat-card__pill py-pill--blue">Sub-4h SLA</span>
                <span>8.2x Higher Response</span>
              </div>
            </div>
          </div>

          {/* Stat Card 2: Spam Reduction */}
          <div className="lp-col-4 col-span-4 lp-stat-card">
            <div className="lp-stat-card__inner">
              <div className="lp-stat-card__metric py-stat-metric--gold">
                –89%
              </div>
              <p className="lp-stat-card__label cs-body">
                Reduction in unsolicited spam pitches and impersonation attempts through two-tier biometric KYC.
              </p>
              <div className="lp-stat-card__footer cs-code2">
                <span className="lp-stat-card__pill py-pill--gold">Verified Network</span>
                <span>Zero Fake Accounts</span>
              </div>
            </div>
          </div>

          {/* Closing Narrative Card */}
          <div className="lp-col-4 col-span-4 lp-closing-card">
            <div className="lp-closing-card__inner">
              <h3 className="lp-closing-card__headline cs-h3">
                A Sanctuary for High-Stakes Minds
              </h3>

              <p className="lp-closing-card__desc cs-body">
                By designing escrow accountability into every interaction, Pairty proved that
                exclusivity and access don&rsquo;t have to be at odds. When everyone has skin in the
                game, professional networking ceases to be a spam war and becomes a high-velocity
                catalyst for human venture capital.
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
                <span className="lp-learnings__bullet py-bullet--blue" aria-hidden="true" />
                <p className="lp-learnings__text">
                  <strong>Friction can be a powerful curation tool:</strong> In an era of automated
                  AI spam, demanding identity verification and financial commitment filters out low-intent noise before it reaches busy executives.
                </p>
              </li>
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet py-bullet--blue" aria-hidden="true" />
                <p className="lp-learnings__text">
                  <strong>Clear contracts unlock generosity:</strong> When advisors know they are
                  only committing to a structured 4-message consultation with guaranteed escrow, they are exponentially more willing to engage deeply.
                </p>
              </li>
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet py-bullet--blue" aria-hidden="true" />
                <p className="lp-learnings__text">
                  <strong>Financial reassurance must be bidirectional:</strong> Auto-refunds protect
                  the buyer; escrow settlement protects the seller. Trust only scales when neither party can be exploited.
                </p>
              </li>
              <li className="lp-learnings__item">
                <span className="lp-learnings__bullet py-bullet--blue" aria-hidden="true" />
                <p className="lp-learnings__text">
                  <strong>Prestige is communicated through restraint:</strong> Tactile dark-mode
                  interfaces, crisp typography, and metallic digital membership cards give members the psychological sensation of entering an exclusive private room.
                </p>
              </li>
            </ul>
          </div>

          {/* Right Column: Lego Minifigure Diorama */}
          <div className="lp-col-5 col-span-5 lp-learnings__right">
            <div className="lp-learnings__media-wrap">
              <img
                src="/case-studies/pairty/lego-learnings.jpg"
                alt="Lego product designer minifigure at illuminated workstation analyzing network graph and gold tokens"
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
