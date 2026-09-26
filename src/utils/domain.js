export function isWorkDomain() {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname.toLowerCase();

  return (
    hostname.startsWith("work.") ||
    hostname === "work.nikbobbary.com" ||
    search.get("subdomain") === "work" ||
    search.get("work") === "true" ||
    pathname === "/work" ||
    pathname.startsWith("/work/")
  );
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
