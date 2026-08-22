import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import ActionButton from "./ActionButton.jsx";
import { BOTTOM_JUMPS, CONTACT } from "../data/nav.js";

const SPY_LINE = 0.32;
const SPY_IDS = BOTTOM_JUMPS.filter((item) => item.href.startsWith("#")).map(
  (item) => item.id
);

function getActiveJump(pathname) {
  if (pathname.startsWith("/project/lore")) return "lore";

  const line = window.innerHeight * SPY_LINE;
  let current = "home";
  for (const id of SPY_IDS) {
    const node = document.getElementById(id);
    if (!node) continue;
    if (node.getBoundingClientRect().top <= line) current = id;
  }
  return current;
}

export default function BottomNav({ visible }) {
  const { pathname } = useLocation();
  const [active, setActive] = useState(() => getActiveJump(pathname));

  useEffect(() => {
    const sync = () => setActive(getActiveJump(pathname));
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [pathname]);

  return (
    <nav
      className={`bottom-nav${visible ? " is-visible" : ""}`}
      aria-label="Page jumps"
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="bottom-nav__cluster">
        <div className="bottom-nav__pill">
          <div className="bottom-nav__links">
            {BOTTOM_JUMPS.map(({ id, label, href, icon }) => {
              const isActive = active === id;
              return (
                <ActionButton
                  key={id}
                  className={`bottom-nav__icon${isActive ? " is-active" : ""}`}
                  href={href}
                  aria-label={label}
                  aria-current={isActive ? "true" : undefined}
                  tabIndex={visible ? 0 : -1}
                >
                  <span className="bottom-nav__glyph">
                    <HugeiconsIcon icon={icon} size={18} strokeWidth={1} />
                  </span>
                  <span className="bottom-nav__hint">
                    <span className="bottom-nav__hint-text">{label}</span>
                  </span>
                </ActionButton>
              );
            })}
          </div>
        </div>
        <div className="bottom-nav__pill">
          <ActionButton
            className="bottom-nav__cta"
            href={CONTACT.href}
            external={CONTACT.external}
            tabIndex={visible ? 0 : -1}
          >
            <HugeiconsIcon
              className="bottom-nav__cta-icon"
              icon={Calendar03Icon}
              size={16}
              strokeWidth={1}
            />
            {CONTACT.label}
          </ActionButton>
        </div>
      </div>
    </nav>
  );
}
