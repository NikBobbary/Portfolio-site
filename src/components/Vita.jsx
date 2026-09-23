const GROUPS = [
  {
    id: "now",
    label: "Right now",
    items: [{ name: "Nesaasity", note: "building and designing" }],
  },
  {
    id: "previously",
    label: "Previously",
    items: [
      { name: "Pathfndr", note: "B2B travel · 2M+ users" },
      {
        name: "Focusoft",
        note: "Lead Designer · 8 SaaS products",
        href: "#focusoft",
      },
      { name: "Lessonpal", note: "EdTech · 10K+ users", href: "#lessonpal" },
    ],
  },
  {
    id: "also",
    label: "Also built",
    items: [
      {
        cluster: [
          { name: "DYO Cars", href: "#dyocar" },
          { name: "HappyHustle" },
          { name: "Pairty", href: "#pairty" },
        ],
      },
    ],
  },
  {
    id: "education",
    label: "Education",
    items: [{ name: "IIT Kharagpur", note: "Mechanical Engineering" }],
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
          aria-labelledby={`vita-${group.id}`}
        >
          <h2 id={`vita-${group.id}`} className="vita__label">
            {group.label}
          </h2>
          <ul className="vita__list">
            {group.items.map((item, index) => (
              <li key={`${group.id}-${index}`} className="vita__item">
                {item.cluster ? (
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
                ) : (
                  <>
                    <Name name={item.name} href={item.href} />
                    {item.note ? (
                      <span className="vita__note">{item.note}</span>
                    ) : null}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
