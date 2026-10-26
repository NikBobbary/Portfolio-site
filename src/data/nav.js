import {
  AtIcon,
  Calendar03Icon,
  Files02Icon,
  GalleryVerticalIcon,
  GithubIcon,
  Home01Icon,
  JokerIcon,
  Linkedin01Icon,
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
    id: "cal",
    label: "Book a slot",
    tooltip: "Book a slot",
    href: "https://cal.com/nikbobbary",
    icon: Calendar03Icon,
    external: true,
  },
];

export const CONTACT = {
  label: "Copy email",
  email: "nikbobbary@gmail.com",
  href: "mailto:nikbobbary@gmail.com",
  calHref: "https://cal.com/nikbobbary",
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
    id: "about",
    label: "About",
    tooltip: "About",
    href: "#about",
    icon: JokerIcon,
  },
  {
    id: "contact",
    label: "Contact",
    tooltip: "Contact",
    href: "#contact",
    icon: AtIcon,
  },
];

export const WORK_BOTTOM_JUMPS = [
  {
    id: "home",
    label: "Home",
    tooltip: "Hero",
    href: "#home",
    icon: Home01Icon,
  },
  {
    id: "cases",
    label: "Cases",
    tooltip: "Cases",
    href: "#cases",
    icon: Files02Icon,
  },
  {
    id: "about",
    label: "About",
    tooltip: "About",
    href: "#about",
    icon: JokerIcon,
  },
  {
    id: "snapshots",
    label: "Snaps",
    tooltip: "Snaps",
    href: "#snapshots",
    icon: GalleryVerticalIcon,
  },
  {
    id: "contact",
    label: "Contact",
    tooltip: "Contact",
    href: "#contact",
    icon: AtIcon,
  },
];

