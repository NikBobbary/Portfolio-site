import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import ActionButton from "./ActionButton.jsx";
import FooterName from "./FooterName.jsx";
import { CONTACT, SOCIAL } from "../data/nav.js";
import { useCopyEmail } from "../utils/useCopyEmail.js";
import PlayProgressBar from "./PlayProgressBar.jsx";

export default function Footer() {
  const { copied, copy } = useCopyEmail();

  return (
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <div className="contact__box">
        <div className="contact__stage">
          <div className="contact__inner">
            <span className="contact__kicker">
              <span className="contact__kicker-line" aria-hidden="true" />
              Collaboration
            </span>
            <h2 id="contact-heading" className="contact__title">
              Let’s build something people can rely on
            </h2>
            <div className="contact__actions">
              <ActionButton
                className={`hero__cta hero__cta--primary contact__primary-btn${copied ? " is-copied" : ""}`}
                onClick={copy}
                tooltip={copied ? "Copied to clipboard!" : CONTACT.email}
                tooltipPlace="below"
                aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
              >
                <HugeiconsIcon
                  className="contact__cta-icon"
                  icon={copied ? Tick01Icon : Copy01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
                {copied ? "Copied!" : CONTACT.label}
              </ActionButton>
              <div className="contact__social">
                {SOCIAL.map(({ id, label, href, icon, tooltip, external }) => (
                  <ActionButton
                    key={id}
                    className="contact__icon"
                    href={href}
                    external={external}
                    tooltip={tooltip}
                    tooltipPlace="below"
                    aria-label={label}
                  >
                    <HugeiconsIcon icon={icon} size={18} strokeWidth={1} />
                  </ActionButton>
                ))}
              </div>
            </div>
          </div>
          <div className="contact__extra">
            <a
              className="contact__studio-card"
              href="https://nesaasity.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Nesaasity - Design and Development Studio"
            >
              <div className="contact__studio-header">
                <span className="contact__studio-badge">
                  <span className="contact__studio-dot" aria-hidden="true" />
                  design &amp; dev studio
                </span>
                <span className="contact__studio-arrow" aria-hidden="true">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
              </div>
              <div className="contact__studio-body">
                <h3 className="contact__studio-name">nesaasity</h3>
                <p className="contact__studio-desc">
                  0 → 1 MVP engineering, high-voltage UI/UX, and AI-native products.
                </p>
              </div>
              <div className="contact__studio-footer">
                <span className="contact__studio-link-text">
                  Visit studio
                  <span className="contact__studio-link-chevron" aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          </div>
        </div>
        <FooterName />
      </div>
      <div className="contact__legal">
        <p className="contact__copyright">
          © {new Date().getFullYear()} Nikitha Bobbary
        </p>
        <div className="contact__legal-meta">
          <span className="contact__status-badge">
            <span className="contact__status-dot" aria-hidden="true" />
            Available for select 0 → 1 projects
          </span>
          <button
            type="button"
            className="contact__back-top"
            onClick={() => {
              if (window.lenis) {
                window.lenis.scrollTo(0);
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            aria-label="Back to top"
          >
            Back to top
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
      <PlayProgressBar />
    </section>
  );
}
