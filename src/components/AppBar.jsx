import { forwardRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import ActionButton from "./ActionButton.jsx";
import { CONTACT, SOCIAL } from "../data/nav.js";

const AppBar = forwardRef(function AppBar(_, ref) {
  return (
    <nav ref={ref} className="appbar" aria-label="Primary">
      <div className="appbar__social">
        {SOCIAL.map(({ id, label, href, icon, tooltip, external }) => (
          <ActionButton
            key={id}
            className="appbar__icon"
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
      <ActionButton
        className="appbar__cta"
        href={CONTACT.href}
        external={CONTACT.external}
      >
        <HugeiconsIcon
          className="appbar__cta-icon"
          icon={Calendar03Icon}
          size={16}
          strokeWidth={1.5}
        />
        {CONTACT.label}
      </ActionButton>
    </nav>
  );
});

export default AppBar;
