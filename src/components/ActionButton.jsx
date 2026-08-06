function go(href, { external = false } = {}) {
  if (!href) return;

  if (href.startsWith("#")) {
    const target = document.getElementById(href.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", href);
    }
    return;
  }

  if (external) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.assign(href);
}

export default function ActionButton({
  href,
  external = false,
  tooltip,
  tooltipPlace,
  className,
  children,
  onClick,
  ...props
}) {
  return (
    <button
      type="button"
      className={className}
      data-tooltip={tooltip || undefined}
      data-tooltip-place={tooltipPlace || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        go(href, { external });
      }}
      {...props}
    >
      {children}
    </button>
  );
}
