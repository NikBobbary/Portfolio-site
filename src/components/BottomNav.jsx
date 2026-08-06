import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import ActionButton from "./ActionButton.jsx";
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
          {SOCIAL.map(({ id, label, href, icon, tooltip }) => (
            <ActionButton
              key={id}
              className="bottom-nav__icon"
              href={href}
              external
              tooltip={tooltip}
              aria-label={label}
              tabIndex={visible ? 0 : -1}
            >
              <HugeiconsIcon icon={icon} size={18} strokeWidth={1} />
            </ActionButton>
          ))}
        </div>
        <ActionButton
          className="bottom-nav__cta"
          href={CONTACT.href}
          tooltip={CONTACT.tooltip}
          tabIndex={visible ? 0 : -1}
        >
          <HugeiconsIcon
            className="bottom-nav__cta-icon"
            icon={Mail01Icon}
            size={16}
            strokeWidth={1}
          />
          {CONTACT.label}
        </ActionButton>
      </div>
    </nav>
  );
}
