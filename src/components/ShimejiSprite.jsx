import { SPRITES } from "../data/shimeji.js";

const NAMES = [
  "stand",
  "walk-0",
  "walk-1",
  "sit",
  "fall",
  "splat",
  "climb-0",
  "climb-1",
];

if (typeof window !== "undefined") {
  Object.values(SPRITES).forEach((set) => {
    NAMES.forEach((name) => {
      const img = new Image();
      img.src = set[name];
    });
  });
}

export default function ShimejiSprite({ variant = 0 }) {
  const set = SPRITES[variant] ?? SPRITES[0];

  return (
    <>
      {NAMES.map((name) => (
        <img
          key={name}
          className={`shimeji__sprite shimeji__sprite--${name}`}
          src={set[name]}
          alt=""
          draggable={false}
        />
      ))}
    </>
  );
}
