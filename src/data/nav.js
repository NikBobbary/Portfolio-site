import {
  GithubIcon,
  Linkedin01Icon,
  Mail01Icon,
  InstagramIcon,
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

export const SECTIONS = [
  { id: "home", label: "Home", tooltip: "Go to home" },
  { id: "snapshots", label: "Snapshots", tooltip: "Jump to snapshots" },
  { id: "about", label: "About", tooltip: "Jump to about" },
];
