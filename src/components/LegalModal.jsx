import { useEffect, useId, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import ActionButton from "./ActionButton.jsx";

export default function LegalModal({ doc, onClose }) {
  const titleId = useId();
  const closeRef = useRef(null);
  const open = Boolean(doc);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="legal-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="legal-modal__veil"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="legal-modal__panel">
        <header className="legal-modal__header">
          <div className="legal-modal__heading">
            <h2 id={titleId} className="legal-modal__title">
              {doc.title}
            </h2>
            <p className="legal-modal__updated">Updated {doc.updated}</p>
          </div>
          <ActionButton
            ref={closeRef}
            className="legal-modal__close"
            tooltip="Close"
            aria-label="Close"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} />
          </ActionButton>
        </header>
        <div className="legal-modal__body">
          {doc.sections.map(({ heading, body }) => (
            <section key={heading} className="legal-modal__section">
              <h3 className="legal-modal__section-title">{heading}</h3>
              <p className="legal-modal__section-body">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
