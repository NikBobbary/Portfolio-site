import { forwardRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import ActionButton from "./ActionButton.jsx";
import { CONTACT, SOCIAL } from "../data/nav.js";
import { useCopyEmail } from "../utils/useCopyEmail.js";

const AppBar = forwardRef(function AppBar(_, ref) {
  const { copied, copy } = useCopyEmail();

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
        className={`appbar__cta${copied ? " is-copied" : ""}`}
        onClick={copy}
        aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
      >
        <HugeiconsIcon
          className="appbar__cta-icon"
          icon={copied ? Tick01Icon : Copy01Icon}
          size={16}
          strokeWidth={1.5}
        />
        {copied ? "Copied!" : CONTACT.label}
      </ActionButton>
    </nav>
  );
});

export default AppBar;
