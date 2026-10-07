/**
 * ScreenMockup
 * 
 * Renders a dark-theme presentation canvas framing a precision hardware device
 * (iPad / landscape display) with rounded corners, subtle chamfered titanium bezel,
 * centered front camera dot, and realistic screen glass sheen.
 */
export default function ScreenMockup({
  src,
  alt = "Case study screen mockup",
  width,
  height,
  accent = "neutral",
  className = "",
}) {
  return (
    <div
      className={`screen-mockup-canvas screen-mockup-canvas--${accent} ${className}`.trim()}
    >
      {/* Ambient backdrop glow suited for dark mode */}
      <div className="screen-mockup-glow" aria-hidden="true" />

      {/* Device hardware frame (landscape display / tablet) */}
      <div className="screen-mockup-device">
        {/* Hardware details: top camera/sensor dot */}
        <div className="screen-mockup-camera" aria-hidden="true" />

        {/* Inner screen display */}
        <div className="screen-mockup-screen">
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="screen-mockup-image"
            loading="lazy"
            decoding="async"
          />
          {/* Subtle screen reflection / glass sheen */}
          <div className="screen-mockup-sheen" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
