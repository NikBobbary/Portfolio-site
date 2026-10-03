export function isWorkSubdomain() {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname.toLowerCase();
  const search = new URLSearchParams(window.location.search);

  // Explicit query param overrides (useful for testing both landings on any host)
  if (
    search.get("subdomain") === "work" ||
    search.get("domain") === "work" ||
    search.get("work") === "true"
  ) {
    return true;
  }
  if (
    search.get("subdomain") === "www" ||
    search.get("domain") === "www" ||
    search.get("work") === "false"
  ) {
    return false;
  }

  // Work subdomain checks (work.nikbobbary.com, work.localhost, or any hostname starting with work.)
  return (
    hostname === "work.nikbobbary.com" ||
    hostname.startsWith("work.")
  );
}

export function isLocalhost() {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname.toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function isWorkDomain() {
  return isWorkSubdomain();
}

export function redirectToMain() {
  if (typeof window === "undefined") return;
  if (isLocalhost()) return;
  window.location.replace("https://nikbobbary.com");
}

export function redirectToWork() {
  if (typeof window === "undefined") return;
  if (isLocalhost()) return;
  window.location.replace("https://work.nikbobbary.com");
}

export function applyNoIndexMeta(enabled = true) {
  if (typeof document === "undefined") return;

  const metaNames = ["robots", "googlebot"];
  metaNames.forEach((name) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (enabled) {
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        el.setAttribute("name", name);
        el.content = "noindex, nofollow, noarchive";
        el.setAttribute("content", "noindex, nofollow, noarchive");
        document.head.appendChild(el);
      } else {
        el.content = "noindex, nofollow, noarchive";
        el.setAttribute("content", "noindex, nofollow, noarchive");
      }
    } else if (el) {
      el.remove();
    }
  });
}
