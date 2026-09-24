import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import ActionButton from "./ActionButton.jsx";
import { BOTTOM_JUMPS, CONTACT, SOCIAL, WORK_BOTTOM_JUMPS } from "../data/nav.js";
import { isWorkDomain } from "../utils/domain.js";

const SPY_LINE = 0.32;

function getActiveJump(pathname, isWorkMode) {
  if (pathname.startsWith("/project/lore")) return "lore";

  const jumps = isWorkMode ? WORK_BOTTOM_JUMPS : BOTTOM_JUMPS;
  const spyIds = jumps
    .filter((item) => item.href.startsWith("#"))
    .map((item) => item.id);

  const line = window.innerHeight * SPY_LINE;
  let current = "home";
  for (const id of spyIds) {
    const node = document.getElementById(id);
    if (!node) continue;
    if (node.getBoundingClientRect().top <= line) current = id;
  }
  return current;
}

export default function BottomNav({ visible, isWork: propIsWork }) {
  const isWork = propIsWork !== undefined ? propIsWork : isWorkDomain();
  const jumps = isWork ? WORK_BOTTOM_JUMPS : BOTTOM_JUMPS;
  const { pathname } = useLocation();
  const [active, setActive] = useState(() => getActiveJump(pathname, isWork));

  useEffect(() => {
    const sync = () => setActive(getActiveJump(pathname, isWork));
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [pathname, isWork]);

  return (
    <nav
      className={`bottom-nav${visible ? " is-visible" : ""}`}
      aria-label="Page jumps and social"
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="bottom-nav__cluster">
        <div className="bottom-nav__pill">
          <div className="bottom-nav__links">
            {jumps.map(({ id, label, href, icon }) => {
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
                    <HugeiconsIcon icon={icon} size={17} strokeWidth={1} />
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
          <div className="bottom-nav__links">
            {SOCIAL.map(({ id, label, href, icon, tooltip, external }) => (
              <ActionButton
                key={id}
                className="bottom-nav__icon bottom-nav__icon--social"
                href={href}
                external={external}
                tooltip={tooltip}
                aria-label={label}
                tabIndex={visible ? 0 : -1}
              >
                <span className="bottom-nav__glyph">
                  <HugeiconsIcon icon={icon} size={17} strokeWidth={1} />
                </span>
              </ActionButton>
            ))}
            <ActionButton
              className="bottom-nav__cta"
              href={CONTACT.href}
              external={CONTACT.external}
              tabIndex={visible ? 0 : -1}
            >
              <HugeiconsIcon
                className="bottom-nav__cta-icon"
                icon={Calendar03Icon}
                size={15}
                strokeWidth={1}
              />
              {CONTACT.label}
            </ActionButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
