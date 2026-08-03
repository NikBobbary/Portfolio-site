import { forwardRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { CONTACT, SOCIAL } from "../data/nav.js";

const AppBar = forwardRef(function AppBar(_, ref) {
  return (
    <nav ref={ref} className="appbar" aria-label="Primary">
      <div className="appbar__social">
        {SOCIAL.map(({ id, label, href, icon }) => (
          <a
            key={id}
            className="appbar__icon"
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
          >
            <HugeiconsIcon icon={icon} size={18} strokeWidth={1} />
          </a>
        ))}
      </div>
      <a className="appbar__cta" href={CONTACT.href}>
        <HugeiconsIcon
          className="appbar__cta-icon"
          icon={Mail01Icon}
          size={16}
          strokeWidth={1}
        />
        {CONTACT.label}
      </a>
    </nav>
  );
});

export default AppBar;
