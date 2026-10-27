export function isPlaySubdomain() {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname.toLowerCase();
  const search = new URLSearchParams(window.location.search);

  if (
    search.get("subdomain") === "play" ||
    search.get("domain") === "play" ||
    search.get("play") === "true"
  ) {
    return true;
  }

  return (
    hostname === "play.nikbobbary.com" ||
    hostname.startsWith("play.")
  );
}

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
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  );
}

export function isWorkDomain() {
  return isWorkSubdomain();
}

export function redirectToMain() {
  if (typeof window === "undefined") return;
  if (isLocalhost()) return;
  window.location.replace("https://nikbobbary.com");
}

export function getWorkUrl() {
  if (typeof window === "undefined") return "https://work.nikbobbary.com";

  const hostname = window.location.hostname.toLowerCase();
  const port = window.location.port ? `:${window.location.port}` : "";
  const protocol = window.location.protocol;

  // Local development
  if (isLocalhost()) {
    if (hostname === "localhost" || hostname.endsWith(".localhost")) {
      return `${protocol}//work.localhost${port}/`;
    }
    return `${protocol}//${window.location.host}/?subdomain=work`;
  }

  // Production domain
  return "https://work.nikbobbary.com";
}

export function redirectToWork() {
  if (typeof window === "undefined") return;
  window.location.replace(getWorkUrl());
}

export function getPlayUrl() {
  if (typeof window === "undefined") return "https://play.nikbobbary.com";

  const hostname = window.location.hostname.toLowerCase();
  const port = window.location.port ? `:${window.location.port}` : "";
  const protocol = window.location.protocol;

  // Already on play subdomain
  if (isPlaySubdomain()) {
    return `${protocol}//${window.location.host}/`;
  }

  // Local development: use play.localhost:port
  if (isLocalhost()) {
    if (hostname === "localhost" || hostname.endsWith(".localhost")) {
      return `${protocol}//play.localhost${port}/`;
    }
    // Fallback for IP addresses (e.g. 127.0.0.1)
    return `${protocol}//${window.location.host}/?subdomain=play`;
  }

  // Production domain
  if (hostname.endsWith("nikbobbary.com")) {
    return "https://play.nikbobbary.com";
  }

  // Preview deployments (Vercel, Netlify)
  if (hostname.includes("vercel.app") || hostname.includes("netlify.app")) {
    return `${protocol}//${window.location.host}/?subdomain=play`;
  }

  return `${protocol}//play.${hostname}${port}/`;
}

export function redirectToPlay() {
  if (typeof window === "undefined") return;
  window.location.replace(getPlayUrl());
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
