import {
  AtIcon,
  GithubIcon,
  Home01Icon,
  InstagramIcon,
  Linkedin01Icon,
  Mail01Icon,
  WorkIcon,
} from "@hugeicons/core-free-icons";

export const SOCIAL = [
  {
    id: "github",
    label: "GitHub",
    tooltip: "GitHub",
    href: "https://github.com/nikbobbary",
    icon: GithubIcon,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    tooltip: "LinkedIn",
    href: "https://www.linkedin.com/in/nikbobbary",
    icon: Linkedin01Icon,
    external: true,
  },
  {
    id: "email",
    label: "Email",
    tooltip: "Send Email",
    href: "mailto:nikbobbary@gmail.com",
    icon: Mail01Icon,
  },
  {
    id: "instagram",
    label: "Instagram",
    tooltip: "Instagram",
    href: "https://instagram.com/nikbobbary",
    icon: InstagramIcon,
    external: true,
  },
];

export const CONTACT = {
  label: "Book a call",
  tooltip: "cal.com",
  href: "https://cal.com/nikbobbary",
  external: true,
};

export const BOTTOM_JUMPS = [
  {
    id: "home",
    label: "Home",
    tooltip: "Hero",
    href: "#home",
    icon: Home01Icon,
  },
  {
    id: "snapshots",
    label: "Works",
    tooltip: "Works",
    href: "#snapshots",
    icon: WorkIcon,
  },
  {
    id: "contact",
    label: "Contact",
    tooltip: "Contact",
    href: "#contact",
    icon: AtIcon,
  },
];
