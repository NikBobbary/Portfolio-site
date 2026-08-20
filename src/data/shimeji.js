export const STORAGE_KEY = "minimal-shimeji";
export const MAX_PETS = 2;
export const WIDTH = 72;
export const HEIGHT = 76;
export const SPAWN_DELAY_MS = 700;

export const SPRITES = {
  0: {
    stand: "/shimeji/pet1/stand.png",
    "walk-0": "/shimeji/pet1/walk-0.png",
    "walk-1": "/shimeji/pet1/walk-1.png?v=2",
    sit: "/shimeji/pet1/sit.png?v=2",
    fall: "/shimeji/pet1/fall.png",
    splat: "/shimeji/pet1/splat.png",
    "climb-0": "/shimeji/pet1/climb-0.png",
    "climb-1": "/shimeji/pet1/climb-1.png",
  },
  1: {
    stand: "/shimeji/pet2/stand.png",
    "walk-0": "/shimeji/pet2/walk-0.png",
    "walk-1": "/shimeji/pet2/walk-1.png",
    sit: "/shimeji/pet2/sit.png",
    fall: "/shimeji/pet2/fall.png",
    splat: "/shimeji/pet2/splat.png",
    "climb-0": "/shimeji/pet2/climb-0.png",
    "climb-1": "/shimeji/pet2/climb-1.png",
  },
};

export const LEDGE_SELECTORS = [
  ".work-frame-wrap",
  ".about__portrait",
  ".contact__box",
  ".bottom-nav.is-visible .bottom-nav__pill",
].join(", ");

export function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export function prefersShimeji() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  const fine =
    window.matchMedia("(any-pointer: fine)").matches ||
    window.matchMedia("(pointer: fine)").matches;
  if (!fine && window.matchMedia("(pointer: coarse)").matches) return false;
  return localStorage.getItem(STORAGE_KEY) !== "off";
}
