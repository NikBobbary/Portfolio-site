import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  Linkedin01Icon,
  Calendar03Icon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";

const SOCIAL = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/nikbobbary",
    icon: GithubIcon,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nikbobbary",
    icon: Linkedin01Icon,
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "https://cal.com/nikbobbary",
    icon: Calendar03Icon,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/nikbobbary",
    icon: InstagramIcon,
  },
];

export default function AppBar() {
  return (
    <nav className="appbar" aria-label="Primary">
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
      <a className="appbar__cta" href="mailto:nikbobbary@gmail.com">
        Get in touch
      </a>
    </nav>
  );
}
