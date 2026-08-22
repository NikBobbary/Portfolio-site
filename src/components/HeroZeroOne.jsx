import { useCallback, useEffect, useRef, useState } from "react";

const STEPS = [0.25, 0.05, 0.02, 0.2, 0.04];
const DURATION_MS = {
  0.25: 1000,
  0.2: 1000,
  0.05: 1500,
  0.02: 1500,
  0.04: 3000,
};

function formatValue(value, step) {
  if (value <= 0) return "0";
  if (value >= 1) return "1";
  const places = step === 0.2 ? 1 : Math.min(2, (String(step).split(".")[1] || "00").length);
  return value.toFixed(places).replace(/\.?0+$/, "");
}

export default function HeroZeroOne() {
  const [value, setValue] = useState(0);
  const [step, setStep] = useState(0.25);
  const [active, setActive] = useState(false);
  const timerRef = useRef(0);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return () => window.clearInterval(timerRef.current);
  }, []);

  const stop = useCallback(() => {
    window.clearInterval(timerRef.current);
    timerRef.current = 0;
    setActive(false);
    setValue(0);
  }, []);

  const start = useCallback(() => {
    if (reduceRef.current) return;
    window.clearInterval(timerRef.current);
    const nextStep = STEPS[Math.floor(Math.random() * STEPS.length)];
    setStep(nextStep);
    setActive(true);
    setValue(0);
    const hundredths = Math.round(nextStep * 100);
    const ticks = 100 / hundredths;
    const duration = DURATION_MS[nextStep];
    const interval = duration / ticks;
    let acc = 0;
    timerRef.current = window.setInterval(() => {
      acc += hundredths;
      const nextValue = Math.min(1, acc / 100);
      setValue(nextValue);
      if (nextValue >= 1) {
        window.clearInterval(timerRef.current);
        timerRef.current = 0;
      }
    }, interval);
  }, []);

  return (
    <span
      className="hero__emph hero__zero"
      onPointerEnter={start}
      onPointerLeave={stop}
    >
      <span className="hero__zero-slot"><span className="hero__zero-ghost" aria-hidden="true">0→1</span><span className="hero__zero-num">{active ? formatValue(value, step) : "0→1"}</span></span>
      {" product designer"}
    </span>
  );
}
