const GROUPS = [
  {
    id: "work",
    items: [
      {
        name: "Nesaasity",
        note: "building and designing",
        year: "2026",
      },
      {
        name: "Pathfndr",
        note: "2M+ users · B2B Travel SaaS",
        year: "2026",
      },
      {
        name: "Focusoft",
        note: "8 MVPs in Community, FinTech, AI",
        href: "#focusoft",
        year: "2024–2025",
      },
      {
        name: "Lessonpal",
        note: "EdTech · 1K - 10K+ users",
        href: "#lessonpal",
        year: "2022–2024",
      },
    ],
  },
  {
    id: "also",
    label: "Also worked on",
    items: [
      {
        cluster: [
          { name: "Unplugd" },
          { name: "DYO Cars", href: "#dyocar" },
          { name: "Pathfndr" },
          { name: "HappyHustle" },
          { name: "Pairty", href: "#pairty" },
          { name: "RCFeed" }
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
        year: "2020–2025",
      },
    ],
  },
];

function Name({ name, href }) {
  if (!href) {
    return <span className="vita__name">{name}</span>;
  }

  return (
    <a className="vita__name vita__name--link" href={href}>
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
            {group.items.map((item, index) => (
              <li key={`${group.id}-${index}`} className="vita__item">
                {item.cluster ? (
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
                ) : (
                  <div className="vita__main">
                    <Name name={item.name} href={item.href} />
                    {item.note ? (
                      <span className="vita__note">{item.note}</span>
                    ) : null}
                  </div>
                )}
                {item.year ? (
                  <span className="vita__year">{item.year}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
