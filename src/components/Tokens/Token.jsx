// components/Tokens/Token.jsx
// Plays a frame-by-frame PNG sequence once, then holds the last frame.
// Blink mode shows the last frame with a CSS blink animation.
// If hideAtEnd is true and playing in reverse, token disappears instantly after animation.

import React, { useEffect, useRef, useState, useMemo } from "react";


export default function Token({
  frames = [],
  durationMs = 500,
  className = "",
  blink = false,
  hideAtEnd = false,
}) {
  const [idx, setIdx] = useState(0);
  const [hidden, setHidden] = useState(false);
  const last = Math.max(0, frames.length - 1);
  const timerRef = useRef(null);

  const perFrame = useMemo(() => {
    if (frames.length <= 1) return durationMs;
    return Math.max(16, Math.floor(durationMs / frames.length));
  }, [frames.length, durationMs]);

  useEffect(() => {
    // Blink mode: skip animation logic, show last frame
    if (blink) {
      setIdx(last);
      setHidden(false);
      return;
    }

    if (frames.length <= 1) return;

    setHidden(false);
    setIdx(0);

    let current = 0;
    timerRef.current = setInterval(() => {
      current++;
      if (current >= frames.length) {
        clearInterval(timerRef.current);
        timerRef.current = null;

        // Hide instantly if reverse animation has finished
        if (hideAtEnd && frames[0] !== frames[frames.length - 1]) {
          setHidden(true);
        } else {
          setIdx(last);
        }
      } else {
        setIdx(current);
      }
    }, perFrame);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [frames, perFrame, hideAtEnd, last, blink]);

  if (hidden) return null;

  return (
    <img
      src={frames[idx]}
      alt=""
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
        animation: blink ? "token-blink 0.8s step-end infinite" : "none",
      }}
    />
  );
}
