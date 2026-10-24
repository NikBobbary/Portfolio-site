/**
 * ScreenMockup
 * 
 * Clean, bezel-less presentation for case study card preview images.
 * Displays the artwork directly edge-to-edge without hardware frames,
 * artificial bezels, camera cutouts, or glass reflections.
 */
export default function ScreenMockup({
  src,
  alt = "Case study preview",
  width,
  height,
  accent = "neutral",
  className = "",
}) {
  return (
    <div
      className={`screen-mockup-canvas screen-mockup-canvas--${accent} ${className}`.trim()}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="screen-mockup-image"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
