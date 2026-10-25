export default function WorkHeader({ id, name, tagline, credit, logo }) {
  return (
    <header id={id} className="work-header">
      <div className="work-header__lead">
        {logo ? (
          <img
            className="work-header__logo"
            src={logo}
            alt=""
            width={18}
            height={18}
            draggable={false}
          />
        ) : null}
        <p className="work-header__copy">
          <span className="work-header__name">{name}</span>
          {tagline ? (
            <span className="work-header__tagline">{tagline}</span>
          ) : null}
        </p>
      </div>
      {credit ? <p className="work-header__credit">{credit}</p> : null}
    </header>
  );
}
