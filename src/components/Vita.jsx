const GROUPS = [
  {
    id: "currently",
    label: "Currently",
    items: [
      {
        name: "Nesaasity",
        note: "building and designing",
        href: "https://nesaasity.com/",
      },
    ],
  },
  {
    id: "previously",
    label: "Previously",
    items: [
      {
        name: "Pathfndr",
        note: "B2B Travel · 2M+ users",
        href: "https://www.pathfndr.io/",
      },
      {
        name: "Focusoft",
        note: "Sole Designer · 8 SaaS products in Community, FinTech, AI",
        href: "https://www.focusofthq.com/",
      },
      {
        name: "Lessonpal",
        note: "EdTech · 1K → 10K+ users",
        href: "https://www.linkedin.com/company/lessonpal/",
      },
    ],
  },
  {
    id: "also",
    label: "Also worked on",
    items: [
      {
        cluster: [
          { name: "Unplugd", href: "https://unplugd.co/" },
          { name: "DYO Cars", href: "https://dyocar.com/" },
          { name: "Pathfndr", href: "https://www.pathfndr.io/" },
          { name: "HappyHustle" },
          { name: "Pairty", href: "https://www.pairty.com/" },
          { name: "RCFeed", href: "https://www.rcfeed.com/" }
        ],
      },
    ],
  },
  {
    id: "education",
    label: "Education",
    items: [
      {
        name: "IIT Kharagpur",
        note: "Mechanical Engineering, B.Tech. + M.Tech.",
        href: "https://www.topuniversities.com/universities/indian-institute-technology-kharagpur-iit-kgp#p2-rankings",
      },
    ],
  },
];

function Name({ name, href }) {
  if (!href) {
    return <span className="vita__name">{name}</span>;
  }

  const isExternal = href.startsWith("http");

  return (
    <a
      className="vita__name vita__name--link"
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {name}
    </a>
  );
}

export default function Vita() {
  return (
    <div className="vita">
      {GROUPS.map((group) => (
        <section
          key={group.id}
          className="vita__group"
          aria-labelledby={group.label ? `vita-${group.id}` : undefined}
          aria-label={!group.label ? "Experience" : undefined}
        >
          {group.label ? (
            <h2 id={`vita-${group.id}`} className="vita__label">
              {group.label}
            </h2>
          ) : null}
          <ul className="vita__list">
            {group.items.map((item, index) => {
              if (item.cluster) {
                return (
                  <li key={`${group.id}-${index}`} className="vita__item">
                    <div className="vita__main">
                      <p className="vita__cluster">
                        {item.cluster.map((entry, entryIndex) => (
                          <span key={entry.name}>
                            {entryIndex > 0 ? (
                              <span className="vita__sep" aria-hidden="true">
                                ·
                              </span>
                            ) : null}
                            <Name name={entry.name} href={entry.href} />
                          </span>
                        ))}
                      </p>
                    </div>
                  </li>
                );
              }

              const isExternal = item.href?.startsWith("http");

              return (
                <li
                  key={`${group.id}-${index}`}
                  className={`vita__item${item.href ? " vita__item--linked" : ""}`}
                >
                  {item.href ? (
                    <a
                      className="vita__row-link"
                      href={item.href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <div className="vita__main">
                        <span className="vita__name">{item.name}</span>
                        {item.note ? (
                          <span className="vita__note">{item.note}</span>
                        ) : null}
                      </div>
                    </a>
                  ) : (
                    <div className="vita__main">
                      <span className="vita__name">{item.name}</span>
                      {item.note ? (
                        <span className="vita__note">{item.note}</span>
                      ) : null}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
