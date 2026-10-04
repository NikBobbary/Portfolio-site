import { useState } from "react";

/**
 * ImagePlaceholder: A robust, swappable asset slot for UX case studies.
 * 
 * Supports:
 * - Direct image rendering via `src` prop
 * - Easy image swapping for design assets (`screenshots`, `wireframe`, `hifi design#1`, `hifi design#2`)
 * - High-fidelity fallback SVG/CSS visualizers when `src` is empty or loading fails
 * - Interactive micro-annotation hotspots overlay
 * - Full desktop & mobile responsiveness
 */
export default function ImagePlaceholder({
  name = "asset",
  src,
  alt = "Case study asset preview",
  caption,
  badge,
  aspectRatio = "16 / 10",
  annotations = [],
  fallbackType,
  className = "",
  children,
}) {
  const [imageError, setImageError] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);

  const resolvedFallbackType = fallbackType || (() => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("screenshot")) return "screenshots";
    if (lower.includes("wireframe")) return "wireframe";
    if (lower.includes("hifi") && lower.includes("1")) return "hifi-1";
    if (lower.includes("hifi") && lower.includes("2")) return "hifi-2";
    return "generic";
  })();

  const hasImage = Boolean(src && !imageError);

  return (
    <figure
      className={`cs-asset-slot ${className}`}
      data-asset-name={name}
      style={{ "--asset-aspect-ratio": aspectRatio }}
    >
      <div className="cs-asset-frame">
        {/* Media or Mockup Viewport */}
        <div className="cs-asset-canvas">
          {hasImage ? (
            <img
              src={src}
              alt={alt}
              className="cs-asset-image"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <AssetFallbackVisualizer type={resolvedFallbackType} name={name} />
          )}

          {/* Micro-annotations overlays */}
          {annotations && annotations.length > 0 && (
            <div className="cs-asset-annotations" aria-label="Interactive feature annotations">
              {annotations.map((ann, idx) => {
                const isActive = activeAnnotation === idx;
                return (
                  <div
                    key={ann.id || idx}
                    className={`cs-hotspot ${isActive ? "cs-hotspot--active" : ""}`}
                    style={{ left: ann.x, top: ann.y }}
                    onMouseEnter={() => setActiveAnnotation(idx)}
                    onMouseLeave={() => setActiveAnnotation(null)}
                    onClick={() => setActiveAnnotation(isActive ? null : idx)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Annotation: ${ann.title}`}
                  >
                    <span className="cs-hotspot__pulse" />
                    <span className="cs-hotspot__point">{idx + 1}</span>

                    {/* Popover Callout */}
                    <div className="cs-hotspot__callout">
                      {ann.tag && <span className="cs-hotspot__tag">{ann.tag}</span>}
                      <p className="cs-hotspot__title">{ann.title}</p>
                      {ann.text && <p className="cs-hotspot__desc">{ann.text}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {children}
        </div>
      </div>

      {caption && (
        <figcaption className="cs-asset-caption">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Realistic and elegant UI blueprint visualizer for placeholders
 */
function AssetFallbackVisualizer({ type, name }) {
  if (type === "screenshots") {
    return (
      <div className="cs-mockup-audit">
        <div className="cs-mockup-audit__grid">
          {/* Chat Ticket 1 */}
          <div className="cs-mockup-chat-panel">
            <div className="cs-mockup-chat-header">
              <span className="cs-mockup-avatar">LP</span>
              <div>
                <div className="cs-mockup-line cs-mockup-line--short" />
                <div className="cs-mockup-line cs-mockup-line--tiny" />
              </div>
              <span className="cs-mockup-badge cs-mockup-badge--urgent">Relayed</span>
            </div>
            <div className="cs-mockup-chat-bubble cs-mockup-chat-bubble--incoming">
              "Hi support, my tutor had an emergency. Can we shift Friday's calculus session to Sunday?"
            </div>
            <div className="cs-mockup-chat-bubble cs-mockup-chat-bubble--support">
              "Checking tutor availability with Sarah... waiting for confirmation."
            </div>
            <div className="cs-mockup-flow-arrow">
              <span>Support Middleman Delay (+4.2 hrs)</span>
            </div>
          </div>

          {/* Audit Flow Breakdown */}
          <div className="cs-mockup-flow-panel">
            <div className="cs-mockup-flow-title">Flow Audit: Pre-Redesign Bottleneck</div>
            <div className="cs-mockup-nodes">
              <div className="cs-mockup-node cs-mockup-node--fail">
                <span className="cs-mockup-node__num">01</span>
                <div>
                  <strong>Student initiates</strong>
                  <p>In-app or email support ticket</p>
                </div>
              </div>
              <div className="cs-mockup-node-line" />
              <div className="cs-mockup-node cs-mockup-node--bottleneck">
                <span className="cs-mockup-node__num">02</span>
                <div>
                  <strong>Manual Support Relay</strong>
                  <p>Agent pings tutor & cross-references calendar</p>
                </div>
              </div>
              <div className="cs-mockup-node-line" />
              <div className="cs-mockup-node cs-mockup-node--muted">
                <span className="cs-mockup-node__num">03</span>
                <div>
                  <strong>Dev DB Override</strong>
                  <p>Engineering dependency to update state</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "wireframe") {
    return (
      <div className="cs-mockup-wireframe">
        <div className="cs-wireframe-modal">
          <div className="cs-wireframe-modal__nav">
            <div className="cs-wireframe-chip">Lesson #402 — SAT Math</div>
            <div className="cs-wireframe-pill">Wireframe v1.2</div>
          </div>
          <div className="cs-wireframe-columns">
            <div className="cs-wireframe-calendar">
              <div className="cs-wireframe-row">
                <div className="cs-wireframe-block cs-wireframe-block--header" />
                <div className="cs-wireframe-block cs-wireframe-block--header" />
              </div>
              <div className="cs-wireframe-calendar-grid">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className={`cs-wireframe-day ${i === 4 || i === 8 ? "cs-wireframe-day--active" : ""}`}
                  >
                    <span>{12 + i}</span>
                    <div className="cs-wireframe-day-dot" />
                  </div>
                ))}
              </div>
            </div>
            <div className="cs-wireframe-slots">
              <div className="cs-wireframe-slot-title">Available Slots (Tutor Sync)</div>
              <div className="cs-wireframe-slot cs-wireframe-slot--selected">10:00 AM – 11:00 AM EDT</div>
              <div className="cs-wireframe-slot">02:30 PM – 03:30 PM EDT</div>
              <div className="cs-wireframe-slot">04:00 PM – 05:00 PM EDT</div>
              <div className="cs-wireframe-cta">Confirm Reschedule</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "hifi-1") {
    return (
      <div className="cs-mockup-hifi1">
        <div className="cs-hifi-app-window">
          {/* App Topbar */}
          <div className="cs-hifi-topbar">
            <div className="cs-hifi-brand">
              <span className="cs-hifi-logo-badge">L</span>
              <span className="cs-hifi-logo-text">Lessonpal / Reschedule</span>
            </div>
            <div className="cs-hifi-status-tag">Live Calendar Integration</div>
          </div>

          {/* Main Reschedule Interface */}
          <div className="cs-hifi-body">
            <div className="cs-hifi-lesson-info">
              <div className="cs-hifi-lesson-header">
                <div>
                  <h4 className="cs-hifi-title">AP Biology with Dr. Marcus Vance</h4>
                  <p className="cs-hifi-meta">Current session: Thursday, Oct 12 · 4:00 PM EDT</p>
                </div>
                <span className="cs-hifi-badge cs-hifi-badge--accent">100% Tutor Availability Used</span>
              </div>
            </div>

            <div className="cs-hifi-grid">
              {/* Date selection */}
              <div className="cs-hifi-calendar-card">
                <div className="cs-hifi-card-header">
                  <span>Select a new date</span>
                  <span className="cs-hifi-subtext">October 2023</span>
                </div>
                <div className="cs-hifi-dates-row">
                  <div className="cs-hifi-date-pill">
                    <span className="cs-hifi-date-day">Wed</span>
                    <span className="cs-hifi-date-num">18</span>
                  </div>
                  <div className="cs-hifi-date-pill cs-hifi-date-pill--active">
                    <span className="cs-hifi-date-day">Thu</span>
                    <span className="cs-hifi-date-num">19</span>
                  </div>
                  <div className="cs-hifi-date-pill">
                    <span className="cs-hifi-date-day">Fri</span>
                    <span className="cs-hifi-date-num">20</span>
                  </div>
                  <div className="cs-hifi-date-pill">
                    <span className="cs-hifi-date-day">Mon</span>
                    <span className="cs-hifi-date-num">23</span>
                  </div>
                </div>
              </div>

              {/* Time slot selection */}
              <div className="cs-hifi-times-card">
                <div className="cs-hifi-card-header">
                  <span>Available times (Tutor timezone synced)</span>
                  <span className="cs-hifi-tz-pill">Your Time: EDT (UTC-4)</span>
                </div>
                <div className="cs-hifi-time-slots">
                  <div className="cs-hifi-time-slot">01:00 PM – 02:00 PM</div>
                  <div className="cs-hifi-time-slot cs-hifi-time-slot--selected">
                    03:30 PM – 04:30 PM
                    <span className="cs-hifi-time-slot__check">✓</span>
                  </div>
                  <div className="cs-hifi-time-slot">05:00 PM – 06:00 PM</div>
                </div>
                <div className="cs-hifi-action-row">
                  <span className="cs-hifi-hint">No extra confirmation delay needed</span>
                  <button className="cs-hifi-btn-confirm" type="button">
                    Confirm & Reschedule Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "hifi-2") {
    return (
      <div className="cs-mockup-hifi2">
        <div className="cs-hifi-app-window">
          <div className="cs-hifi-topbar">
            <div className="cs-hifi-brand">
              <span className="cs-hifi-logo-badge">L</span>
              <span className="cs-hifi-logo-text">Tutor Dashboard / Lesson Oversight</span>
            </div>
            <span className="cs-hifi-payout-badge">Payout Protected: On Completion</span>
          </div>

          <div className="cs-hifi-coordination-preview">
            <div className="cs-coordination-card">
              <div className="cs-coordination-header">
                <div className="cs-coordination-avatar">SJ</div>
                <div>
                  <h4 className="cs-coordination-name">Sarah Jenkins (Student)</h4>
                  <p className="cs-coordination-desc">High School Physics · Reschedule proposed</p>
                </div>
                <span className="cs-coordination-tag">Coordination Channel</span>
              </div>

              <div className="cs-coordination-body">
                <div className="cs-coordination-stat-row">
                  <div className="cs-coordination-stat">
                    <span className="cs-coordination-stat__label">Delivery State</span>
                    <span className="cs-coordination-stat__val">Pending Confirmation</span>
                  </div>
                  <div className="cs-coordination-stat">
                    <span className="cs-coordination-stat__label">Tutor Payout Condition</span>
                    <span className="cs-coordination-stat__val cs-coordination-stat__val--accent">
                      Upon Verified Delivery
                    </span>
                  </div>
                </div>

                <div className="cs-coordination-dialog">
                  <span className="cs-coordination-dialog__icon">💬</span>
                  <p>
                    "System prompt sent: Student requested alternative slot outside standard window.
                    Direct coordination link dispatched via SMS & Email."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-asset-generic-fallback">
      <div className="cs-asset-generic-icon">⬚</div>
      <p className="cs-asset-generic-title">{`<${name}>`}</p>
      <p className="cs-asset-generic-sub cs-code2">Dark mode responsive asset frame</p>
    </div>
  );
}
