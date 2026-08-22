import { useEffect } from "react";

const SELECTOR = [
  "h1",
  "h2",
  "h3",
  ".work-header",
  ".cases__name",
  ".contact__brand",
  "img",
].join(", ");

const SKIP = [
  ".hero__name",
  ".hero__dek",
  ".story-hero__title",
  ".story-hero__kicker",
  ".story-hero__dek",
  ".boot",
  ".shimeji-root",
  ".work-frame",
  ".shimeji__sprite",
  ".hero__mark",
  ".work-header__logo",
  ".locale-card__pin",
  ".locale-card__pin-ring",
].join(", ");

function whenReady(el, go) {
  if (el.tagName === "IMG" && !el.complete) {
    const start = () => go();
    el.addEventListener("load", start, { once: true });
    el.addEventListener("error", start, { once: true });
    return;
  }
  go();
}

export default function Reveal() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const watched = new WeakSet();

    const activate = (el) => {
      el.classList.add("is-in");
      if (reduce) {
        el.classList.add("is-sharp");
        return;
      }
      const done = (event) => {
        if (event.target !== el) return;
        if (event.propertyName && event.propertyName !== "filter") return;
        el.classList.add("is-sharp");
        el.removeEventListener("transitionend", done);
      };
      el.addEventListener("transitionend", done);
    };

    const skipped = (el) =>
      el.closest(SKIP) ||
      el.matches(SKIP) ||
      (el.tagName === "IMG" && el.closest("h1, h2, h3, .work-header"));

    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (skipped(el)) return;
        el.classList.add("reveal", "is-in", "is-sharp");
      });
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          whenReady(entry.target, () => activate(entry.target));
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    const watch = (el) => {
      if (watched.has(el) || skipped(el)) return;
      watched.add(el);
      el.classList.add(
        "reveal",
        el.tagName === "IMG" ? "reveal--image" : "reveal--copy"
      );
      io.observe(el);
    };

    const scan = () => {
      document.querySelectorAll(SELECTOR).forEach(watch);
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
