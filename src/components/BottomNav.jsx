import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Home01Icon, JokerIcon, Tick01Icon } from "@hugeicons/core-free-icons";
import ActionButton from "./ActionButton.jsx";
import { BOTTOM_JUMPS, CONTACT, SOCIAL, WORK_BOTTOM_JUMPS } from "../data/nav.js";
import { isWorkDomain } from "../utils/domain.js";
import { useCopyEmail } from "../utils/useCopyEmail.js";

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

export default function BottomNav({
  visible = true,
  isWork: propIsWork,
  socialsOnly = false,
  showHome = false,
  homeHref = "/",
  homeIcon,
  homeTooltip = "Home",
  homeAriaLabel = "Home",
}) {
  const isWork = propIsWork !== undefined ? propIsWork : isWorkDomain();
  const jumps = isWork ? WORK_BOTTOM_JUMPS : BOTTOM_JUMPS;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(() => (socialsOnly ? "" : getActiveJump(pathname, isWork)));
  const { copied, copy } = useCopyEmail();

  const shouldShowHome = showHome || socialsOnly;

  useEffect(() => {
    if (socialsOnly) return;
    const sync = () => setActive(getActiveJump(pathname, isWork));
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [pathname, isWork, socialsOnly]);

  return (
    <nav
      className={`bottom-nav${visible ? " is-visible" : ""}`}
      aria-label={
        socialsOnly
          ? shouldShowHome
            ? "Home and social links"
            : "Social links and contact"
          : "Page jumps and social"
      }
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="bottom-nav__cluster">
        {!socialsOnly && (
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
        )}
        {socialsOnly && shouldShowHome && (
          <div className="bottom-nav__pill">
            <div className="bottom-nav__links">
              <ActionButton
                className="bottom-nav__icon bottom-nav__icon--social"
                href={homeHref}
                onClick={(e) => {
                  if (homeHref.startsWith("http://") || homeHref.startsWith("https://") || homeHref.startsWith("//")) {
                    return; // Let default browser/ActionButton handle external or cross-subdomain URL
                  }
                  e.preventDefault();
                  navigate(homeHref);
                }}
                tooltip={homeTooltip}
                aria-label={homeAriaLabel}
                tabIndex={visible ? 0 : -1}
              >
                <span className="bottom-nav__glyph">
                  <HugeiconsIcon icon={homeIcon || Home01Icon} size={18} strokeWidth={1} />
                </span>
              </ActionButton>
            </div>
          </div>
        )}
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
              className={`bottom-nav__cta${copied ? " is-copied" : ""}`}
              onClick={copy}
              tabIndex={visible ? 0 : -1}
              aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
            >
              <HugeiconsIcon
                className="bottom-nav__cta-icon"
                icon={copied ? Tick01Icon : Copy01Icon}
                size={15}
                strokeWidth={1}
              />
              {copied ? "Copied!" : CONTACT.label}
            </ActionButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
