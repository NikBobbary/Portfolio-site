export default function Boot({ done, progress, scroll = 0 }) {
  const percent = Math.min(100, Math.round(progress * 100));
  const complete = percent >= 100;

  return (
    <div
      className={`boot${complete ? " is-complete" : ""}${done ? " is-done" : ""}`}
      aria-hidden={done}
      aria-busy={!done}
      aria-label={done ? undefined : "Loading work"}
      role={done ? undefined : "status"}
    >
      <p
        className="boot__percent"
        style={{ "--boot-p": `${percent}%` }}
        aria-hidden="true"
      >
        <span className="boot__cluster">
          <span className="boot__face boot__face--ghost">
            <span className="boot__count">{percent}</span>
            <span className="boot__unit">%</span>
          </span>
          <span className="boot__face boot__face--live">
            <span className="boot__count">{percent}</span>
            <span className="boot__unit">%</span>
          </span>
        </span>
      </p>

      <div className="boot__bar" aria-hidden="true">
        <span
          className="boot__fill"
          style={{ transform: `scaleX(${complete ? 1 : progress})` }}
        />
        <span
          className="boot__scroll"
          style={{ transform: `scaleX(${done ? scroll : 0})` }}
        />
      </div>
    </div>
  );
}
