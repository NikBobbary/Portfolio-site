import { useEffect, useRef, useState } from "react";

function splitCaption(text) {
  const parts = [];
  let charIndex = 0;

  for (const segment of text.split(/(\s+)/)) {
    if (segment === "") continue;

    if (/^\s+$/.test(segment)) {
      parts.push({ type: "space", value: segment, index: charIndex });
      charIndex += segment.length;
      continue;
    }

    parts.push({
      type: "word",
      chars: Array.from(segment).map((char) => {
        const index = charIndex;
        charIndex += 1;
        return { char, index };
      }),
    });
  }

  return parts;
}

export default function WorkCaption({ text }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const parts = splitCaption(text);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.2, rootMargin: "0px 0px -4% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={`work-caption${visible ? " is-visible" : ""}`}
      aria-label={text}
    >
      {parts.map((part, partIndex) => {
        if (part.type === "space") {
          return (
            <span
              key={`space-${partIndex}`}
              className="work-caption__char"
              style={{ "--i": part.index }}
              aria-hidden="true"
            >
              {"\u00A0"}
            </span>
          );
        }

        return (
          <span key={`word-${partIndex}`} className="work-caption__word">
            {part.chars.map(({ char, index }) => (
              <span
                key={`${index}-${char}`}
                className="work-caption__char"
                style={{ "--i": index }}
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </p>
  );
}
