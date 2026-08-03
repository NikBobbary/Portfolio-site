import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { CONTACT, SOCIAL } from "../data/nav.js";

export default function BottomNav({ visible }) {
  return (
    <nav
      className={`bottom-nav${visible ? " is-visible" : ""}`}
      aria-label="Quick links"
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="bottom-nav__pill">
        <div className="bottom-nav__social">
          {SOCIAL.map(({ id, label, href, icon }) => (
            <a
              key={id}
              className="bottom-nav__icon"
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              tabIndex={visible ? 0 : -1}
            >
              <HugeiconsIcon icon={icon} size={18} strokeWidth={1} />
            </a>
          ))}
        </div>
        <a
          className="bottom-nav__cta"
          href={CONTACT.href}
          tabIndex={visible ? 0 : -1}
        >
          <HugeiconsIcon
            className="bottom-nav__cta-icon"
            icon={Mail01Icon}
            size={16}
            strokeWidth={1}
          />
          {CONTACT.label}
        </a>
      </div>
    </nav>
  );
}
