import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ShimejiSprite from "./ShimejiSprite.jsx";
import {
  HEIGHT,
  LEDGE_SELECTORS,
  MAX_PETS,
  SPAWN_DELAY_MS,
  STORAGE_KEY,
  WIDTH,
  prefersShimeji,
  randomBetween,
} from "../data/shimeji.js";

const WALK = 0.068;
const GRAVITY = 0.42;
const MAX_FALL = 13;
const CLIMB = 0.078;
const EDGE = 14;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function floorY() {
  return window.innerHeight - 8;
}

function collectLedges() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ledges = [
    {
      left: 0,
      right: width,
      y: floorY(),
      wallL: null,
      wallR: null,
      wallB: height,
      kind: "floor",
    },
  ];

  document.querySelectorAll(LEDGE_SELECTORS).forEach((node) => {
    const box = node.getBoundingClientRect();
    if (box.width < 56 || box.height < 10) return;
    if (box.bottom < 10 || box.top > height - 6) return;
    // Sitting on a ledge at the viewport top puts the body off-screen.
    if (box.top < HEIGHT) return;

    ledges.push({
      left: box.left + 12,
      right: box.right - 12,
      y: box.top + 1,
      wallL: box.left,
      wallR: box.right,
      wallB: Math.min(box.bottom, height),
      kind: "ledge",
    });
  });

  return ledges;
}

function supportAt(x, y, ledges) {
  let match = null;
  for (const ledge of ledges) {
    if (x < ledge.left - 2 || x > ledge.right + 2) continue;
    const delta = ledge.y - y;
    if (delta < -6 || delta > 10) continue;
    if (!match || Math.abs(delta) < Math.abs(match.y - y)) match = ledge;
  }
  return match;
}

function landOn(x, previousY, y, ledges) {
  let hit = null;
  for (const ledge of ledges) {
    if (x < ledge.left || x > ledge.right) continue;
    if (previousY <= ledge.y + 3 && y >= ledge.y) {
      if (!hit || ledge.y < hit.y) hit = ledge;
    }
  }
  return hit;
}

function pickWalkUntil(now) {
  return now + randomBetween(1800, 4800);
}

function pickIdleUntil(now) {
  return now + randomBetween(900, 2600);
}

function pickSitUntil(now) {
  return now + randomBetween(1600, 4200);
}

function createPet(id, variant, now, x) {
  const span = Math.max(120, window.innerWidth - WIDTH);
  const vx = randomBetween(-0.35, 0.35);
  return {
    id,
    variant,
    x: x ?? randomBetween(span * 0.18, span * 0.82),
    y: -HEIGHT,
    vx,
    vy: 2.2,
    facing: vx >= 0 ? 1 : -1,
    action: "fall",
    leaving: false,
    departing: false,
    landed: false,
    until: now + 60_000,
    frame: 0,
    frameAt: now,
    blink: false,
    blinkUntil: 0,
    nextBlink: now + randomBetween(1600, 3800),
    pokes: 0,
    gone: false,
    shooAt: 0,
    drag: false,
    grabX: 0,
    grabY: 0,
    moved: 0,
    samples: [],
    squash: 1,
    opacity: 1,
    scale: 1,
  };
}

function recycleFromTop(pet, now) {
  const span = Math.max(120, window.innerWidth - WIDTH);
  pet.x = randomBetween(span * 0.12, span * 0.88);
  pet.y = -HEIGHT;
  pet.vx = randomBetween(-0.5, 0.5);
  pet.vy = 2.2;
  pet.facing = pet.vx >= 0 ? 1 : -1;
  pet.action = "fall";
  pet.leaving = false;
  pet.departing = false;
  pet.until = now + 60_000;
  pet.squash = 1;
  pet.scale = 1;
}

function isOffscreen(pet, width) {
  return pet.x < -WIDTH || pet.x > width + WIDTH || pet.y > window.innerHeight + HEIGHT;
}

function dismissTowardEdge(pet) {
  pet.drag = false;
  pet.departing = true;
  pet.leaving = true;
  pet.facing = pet.x < window.innerWidth / 2 ? -1 : 1;
  pet.action = "poke";
  pet.vy = -8.2;
  pet.vx = pet.facing * 0.9;
  pet.squash = 1.04;
  pet.until = performance.now() + 220;
}

function nextAction(pet, now, ledges) {
  const ground = supportAt(pet.x, pet.y, ledges);
  const roll = Math.random();

  if (!ground) {
    pet.action = "fall";
    pet.until = now + 60_000;
    return;
  }

  if (roll < 0.48) {
    pet.action = "sit";
    pet.vx = 0;
    pet.until = pickSitUntil(now);
    return;
  }

  if (roll < 0.62) {
    pet.action = "idle";
    pet.vx = 0;
    pet.until = pickIdleUntil(now);
    return;
  }

  if (Math.random() < 0.28) pet.facing *= -1;
  pet.action = "walk";
  pet.vx = pet.facing * WALK;
  pet.until = pickWalkUntil(now);
}

export default function Shimeji({ ready = false }) {
  const [roster, setRoster] = useState([]);
  const petsRef = useRef([]);
  const nodesRef = useRef(new Map());
  const nextId = useRef(0);
  const allowedRef = useRef(false);
  const awayRef = useRef(false);

  const paint = useCallback((pet) => {
    const node = nodesRef.current.get(pet.id);
    if (!node) return;

    const pose =
      pet.action === "spawn"
        ? "fall"
        : pet.action === "drag" && pet.y < 40
          ? "shoo"
          : pet.action;

    node.dataset.pose = pose;
    node.dataset.frame = String(pet.frame);
    node.dataset.blink = pet.blink ? "1" : "0";
    node.classList.toggle("is-held", pet.drag);
    node.style.opacity = String(pet.opacity);
    node.style.pointerEvents = pet.opacity === 0 ? "none" : "auto";
    node.style.transform = [
      `translate3d(${pet.x}px, ${pet.y}px, 0)`,
      "translate(-50%, -100%)",
      `scaleX(${pet.facing})`,
      `scale(${pet.scale})`,
      `scaleY(${pet.squash})`,
    ].join(" ");
  }, []);

  const removePet = useCallback((id, persist = true) => {
    petsRef.current = petsRef.current.filter((pet) => pet.id !== id);
    setRoster((current) => current.filter((pet) => pet.id !== id));
    if (petsRef.current.length === 0) {
      awayRef.current = true;
      if (persist) localStorage.setItem(STORAGE_KEY, "off");
    }
  }, []);

  const spawnPet = useCallback(
    (variant, x) => {
      if (petsRef.current.length >= MAX_PETS) return;
      const now = performance.now();
      const pet = createPet(nextId.current, variant, now, x);
      nextId.current += 1;
      petsRef.current = [...petsRef.current, pet];
      setRoster((current) => [
        ...current,
        { id: pet.id, variant: pet.variant },
      ]);
      localStorage.removeItem(STORAGE_KEY);
    },
    []
  );

  const summon = useCallback(() => {
    if (!allowedRef.current) return;
    if (petsRef.current.length > 0) return;
    awayRef.current = false;
    spawnPet(0);
    spawnPet(1);
  }, [spawnPet]);

  useEffect(() => {
    allowedRef.current = ready && prefersShimeji();
    if (!ready) return undefined;
    if (!prefersShimeji()) {
      allowedRef.current = window.matchMedia("(pointer: fine)").matches;
      return undefined;
    }

    let cancelled = false;
    const first = window.setTimeout(() => {
      if (cancelled || petsRef.current.length > 0) return;
      const wide = window.innerWidth;
      spawnPet(0, wide * 0.34);
    }, SPAWN_DELAY_MS);
    const second = window.setTimeout(() => {
      if (cancelled) return;
      const hasFriend = petsRef.current.some((pet) => pet.variant === 1);
      if (hasFriend || petsRef.current.length >= MAX_PETS) return;
      spawnPet(1, window.innerWidth * 0.66);
    }, SPAWN_DELAY_MS + 520);

    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, [ready, spawnPet]);

  useEffect(() => {
    const onSummonClick = () => {
      if (petsRef.current.length > 0) return;
      if (!awayRef.current && localStorage.getItem(STORAGE_KEY) !== "off") {
        return;
      }
      if (!window.matchMedia("(any-pointer: fine), (pointer: fine)").matches) {
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      allowedRef.current = true;
      summon();
    };

    document.addEventListener("click", onSummonClick);
    return () => document.removeEventListener("click", onSummonClick);
  }, [summon]);

  useEffect(() => {
    const avatar = document.querySelector(".hero__mark");
    if (!avatar) return;
    if (
      localStorage.getItem(STORAGE_KEY) === "off" ||
      (roster.length === 0 && awayRef.current)
    ) {
      avatar.setAttribute("title", "click to call them back");
      avatar.classList.add("is-summon");
    } else {
      avatar.removeAttribute("title");
      avatar.classList.remove("is-summon");
    }
  }, [roster, ready]);

  useEffect(() => {
    if (!ready || roster.length === 0) return undefined;

    let frame = 0;
    let last = performance.now();
    let ledges = collectLedges();
    let ledgeAt = 0;

    const step = (now) => {
      frame = window.requestAnimationFrame(step);
      if (document.hidden) {
        last = now;
        return;
      }

      const dt = Math.min(now - last, 34);
      last = now;

      if (now - ledgeAt > 80) {
        ledges = collectLedges();
        ledgeAt = now;
      }

      const pets = petsRef.current;
      const width = window.innerWidth;

      for (const pet of pets) {
        if (pet.gone) continue;

        pet.squash += (1 - pet.squash) * 0.14;
        pet.scale += ((pet.action === "shoo" ? 0.15 : 1) - pet.scale) * 0.18;

        if (pet.action === "shoo") {
          pet.opacity = clamp(1 - (now - pet.shooAt) / 280, 0, 1);
          if (now >= pet.until) {
            pet.gone = true;
            removePet(pet.id);
          }
          paint(pet);
          continue;
        }

        pet.opacity = 1;

        if (pet.blink && now >= pet.blinkUntil) pet.blink = false;
        if (!pet.blink && now >= pet.nextBlink && pet.action !== "drag") {
          pet.blink = true;
          pet.blinkUntil = now + 110;
          pet.nextBlink = now + randomBetween(1800, 4200);
        }

        if (pet.drag) {
          paint(pet);
          continue;
        }

        if (pet.action === "walk" || pet.action === "climb") {
          if (now - pet.frameAt > 140) {
            pet.frame = pet.frame ? 0 : 1;
            pet.frameAt = now;
          }
        } else {
          pet.frame = 0;
        }

        if (pet.action === "climb") {
          pet.y -= CLIMB * dt;
          if (pet.y <= pet.climbTo) {
            pet.y = pet.climbTo;
            pet.vy = 0;
            pet.action = "sit";
            pet.until = pickSitUntil(now);
          }
          paint(pet);
          continue;
        }

        if (pet.action === "fall" || pet.action === "poke") {
          const previousY = pet.y;
          const tick = dt / 16.67;
          pet.vy = Math.min(pet.vy + GRAVITY * tick, MAX_FALL);
          pet.x += pet.vx * tick;
          pet.y += pet.vy * tick;
          pet.vx *= 0.995;

          if (isOffscreen(pet, width)) {
            if (pet.departing) {
              pet.gone = true;
              removePet(pet.id, false);
            } else {
              recycleFromTop(pet, now);
              paint(pet);
            }
            continue;
          }

          if (!pet.departing) {
            if (pet.x < EDGE) {
              pet.x = EDGE;
              pet.vx = Math.abs(pet.vx) * 0.4;
              pet.facing = 1;
            } else if (pet.x > width - EDGE) {
              pet.x = width - EDGE;
              pet.vx = -Math.abs(pet.vx) * 0.4;
              pet.facing = -1;
            }
          }

          const hit = landOn(pet.x, previousY, pet.y, ledges);
          if (hit) {
            pet.y = hit.y;
            pet.vy = 0;
            pet.vx = 0;
            pet.squash = 0.94;
            pet.landed = true;
            if (pet.departing) {
              pet.action = "walk";
              pet.until = now + 60_000;
            } else {
              pet.leaving = false;
              pet.action = Math.random() < 0.45 ? "sit" : "idle";
              pet.until =
                pet.action === "sit" ? pickSitUntil(now) : pickIdleUntil(now);
            }
          } else if (pet.action === "poke" && now >= pet.until && pet.vy > 0) {
            pet.action = "fall";
          }
          paint(pet);
          continue;
        }

        const ground = supportAt(pet.x, pet.y, ledges);
        if (!ground) {
          pet.action = "fall";
          pet.until = now + 60_000;
          if (pet.departing) {
            pet.vy = 0.9;
            pet.vx = pet.facing * 1.4;
          }
          paint(pet);
          continue;
        }

        pet.y = ground.y;

        if (pet.action === "walk") {
          pet.x += pet.facing * WALK * dt;

          if (pet.departing) {
            paint(pet);
            continue;
          }

          const nearLeft = pet.x <= Math.max(EDGE, ground.left + 6);
          const nearRight = pet.x >= Math.min(width - EDGE, ground.right - 6);

          if (pet.landed && (nearLeft || nearRight)) {
            pet.departing = true;
            pet.leaving = true;
            pet.facing = nearLeft ? -1 : 1;
            pet.until = now + 60_000;
            paint(pet);
            continue;
          }

          let climbing = false;
          for (const ledge of ledges) {
            if (ledge.kind !== "ledge" || ledge.wallL == null) continue;
            const topInView =
              ledge.y > 16 && ledge.y < window.innerHeight * 0.78;
            const closeEnough = pet.y - ledge.y < 320 && pet.y > ledge.y + 24;
            if (!topInView || !closeEnough) continue;
            if (pet.y > ledge.wallB + 4) continue;

            const onRight =
              pet.facing === 1 && Math.abs(pet.x - ledge.wallR) < 10;
            const onLeft =
              pet.facing === -1 && Math.abs(pet.x - ledge.wallL) < 10;
            if ((onRight || onLeft) && pet.y > ledge.y + 24) {
              pet.action = "climb";
              pet.climbTo = ledge.y;
              pet.x = onRight ? ledge.wallR : ledge.wallL;
              pet.until = now + 8000;
              climbing = true;
              break;
            }
          }
          if (climbing) {
            paint(pet);
            continue;
          }

          if (now >= pet.until) nextAction(pet, now, ledges);
        } else if (now >= pet.until) {
          nextAction(pet, now, ledges);
        }

        paint(pet);
      }

      if (pets.length === 2) {
        const [a, b] = pets;
        if (
          !a.gone &&
          !b.gone &&
          !a.drag &&
          !b.drag &&
          !a.leaving &&
          !b.leaving &&
          Math.abs(a.y - b.y) < 10 &&
          Math.abs(a.x - b.x) < 36
        ) {
          if (a.x <= b.x) {
            a.facing = -1;
            b.facing = 1;
          } else {
            a.facing = 1;
            b.facing = -1;
          }
          a.x -= 1;
          b.x += 1;
        }
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [ready, roster.length, paint, removePet]);

  const onPointerDown = (id, event) => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const pet = petsRef.current.find((item) => item.id === id);
    if (!pet || pet.action === "shoo") return;
    pet.drag = true;
    pet.action = "drag";
    pet.leaving = false;
    pet.departing = false;
    pet.vx = 0;
    pet.vy = 0;
    pet.moved = 0;
    pet.grabX = pet.x - event.clientX;
    pet.grabY = pet.y - event.clientY;
    pet.samples = [{ x: pet.x, y: pet.y, t: performance.now() }];
  };

  const onPointerMove = (id, event) => {
    const pet = petsRef.current.find((item) => item.id === id);
    if (!pet?.drag) return;
    const x = event.clientX + pet.grabX;
    const y = event.clientY + pet.grabY;
    pet.moved += Math.hypot(x - pet.x, y - pet.y);
    pet.x = x;
    pet.y = y;
    if (event.movementX) pet.facing = event.movementX > 0 ? 1 : -1;
    pet.samples.push({ x, y, t: performance.now() });
    if (pet.samples.length > 6) pet.samples.shift();
  };

  const onPointerUp = (id) => {
    const pet = petsRef.current.find((item) => item.id === id);
    if (!pet?.drag) return;
    pet.drag = false;
    const now = performance.now();
    const width = window.innerWidth;

    if (pet.moved < 7) {
      dismissTowardEdge(pet);
      return;
    }

    const samples = pet.samples;
    if (samples.length >= 2) {
      const start = samples[0];
      const end = samples[samples.length - 1];
      const elapsed = Math.max(end.t - start.t, 8);
      pet.vx = clamp(((end.x - start.x) / elapsed) * 16, -16, 16);
      pet.vy = clamp(((end.y - start.y) / elapsed) * 16, -18, 16);
    }

    const flungOff =
      pet.y < 10 || pet.x < -24 || pet.x > width + 24 || (pet.y < 36 && pet.vy < -4);

    if (flungOff) {
      pet.action = "shoo";
      pet.shooAt = now;
      pet.until = now + 280;
      pet.vx = 0;
      pet.vy = -1.2;
      return;
    }

    pet.action = "fall";
    pet.until = now + 60_000;
  };

  if (!ready || roster.length === 0) return null;

  return createPortal(
    <div className="shimeji-root" aria-hidden="true">
      {roster.map(({ id, variant }) => (
        <div
          key={id}
          className="shimeji"
          ref={(node) => {
            if (node) {
              nodesRef.current.set(id, node);
              const pet = petsRef.current.find((item) => item.id === id);
              if (pet) paint(pet);
            } else {
              nodesRef.current.delete(id);
            }
          }}
          data-pose="fall"
          data-frame="0"
          data-blink="0"
          title="click to send away"
          onPointerDown={(event) => onPointerDown(id, event)}
          onPointerMove={(event) => onPointerMove(id, event)}
          onPointerUp={() => onPointerUp(id)}
          onPointerCancel={() => onPointerUp(id)}
        >
          <ShimejiSprite variant={variant} />
        </div>
      ))}
    </div>,
    document.body
  );
}
