import { useCallback, useRef } from "react";

const MAX_TILT = 14;

export default function LocaleCard() {
  const faceRef = useRef(null);

  const onPointerMove = useCallback((event) => {
    const face = faceRef.current;
    if (!face) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = face.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    face.style.setProperty("--tilt-x", `${(-y * MAX_TILT).toFixed(2)}deg`);
    face.style.setProperty("--tilt-y", `${(x * MAX_TILT).toFixed(2)}deg`);
  }, []);

  const onPointerLeave = useCallback(() => {
    const face = faceRef.current;
    if (!face) return;
    face.style.setProperty("--tilt-x", "0deg");
    face.style.setProperty("--tilt-y", "0deg");
  }, []);

  return (
    <article
      id="locale-card"
      className="locale-card"
      aria-label="VTZ, India"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="locale-card__face" ref={faceRef}>
        <div className="locale-card__map">
          <img
            className="locale-card__photo"
            src="/locale/vtz-map.png"
            alt=""
            width={2126}
            height={1578}
            draggable={false}
          />
          <span className="locale-card__pin" aria-hidden="true">
            <img
              className="locale-card__pin-ring"
              src="/locale/pin-ring.svg"
              alt=""
              width={96}
              height={96}
              draggable={false}
            />
            <img
              className="locale-card__pin-dot"
              src="/locale/pin.svg"
              alt=""
              width={35}
              height={35}
              draggable={false}
            />
          </span>
        </div>
      </div>
      <p className="locale-card__label">
        <span className="locale-card__city">VTZ</span>
        <span className="locale-card__country">India</span>
      </p>
    </article>
  );
}
