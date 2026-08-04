import { useEffect, useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CenterFocusIcon } from "@hugeicons/core-free-icons";

export default function WorkFrame({
  src,
  revealed,
  decisions = [],
}) {
  const [lensOpen, setLensOpen] = useState(false);
  const panelId = useId();
  const hasDecisions = decisions.length > 0;

  useEffect(() => {
    if (!lensOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setLensOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lensOpen]);

  return (
    <div
      className={[
        "work-frame-wrap",
        revealed ? "is-visible" : "",
        lensOpen ? "is-lens-open" : "",
        hasDecisions ? "has-lens" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={hasDecisions ? () => setLensOpen((open) => !open) : undefined}
    >
      <img className="work-frame" src={src} alt="" />

      {hasDecisions ? (
        <>
          <button
            type="button"
            className="work-lens-btn"
            aria-expanded={lensOpen}
            aria-controls={panelId}
            aria-label={lensOpen ? "Hide decisions" : "Show decisions"}
          >
            <HugeiconsIcon
              icon={lensOpen ? Cancel01Icon : CenterFocusIcon}
              size={16}
              strokeWidth={1}
            />
            {lensOpen ? null : <span>Decisions</span>}
          </button>

          <div
            id={panelId}
            className={`work-lens${lensOpen ? " is-open" : ""}`}
            aria-hidden={!lensOpen}
          >
            <div className="work-lens__veil" aria-hidden="true" />
            {decisions.map((decision, index) => (
              <div
                key={`${src}-decision-${index}`}
                className="work-callout"
                style={{
                  "--x": decision.x,
                  "--y": decision.y,
                  "--i": index,
                }}
              >
                <span className="work-callout__pin" aria-hidden="true" />
                <p className="work-callout__text">{decision.text}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
