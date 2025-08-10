// components/Board.jsx
// Renders the TV UI with background PNG, grid, tokens, shine overlay, and status text.
// Status text: floats over the TV background image, shows game start, turns, win, and stalemate.

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import LayoutSVG from "./Graphics/LayoutSVG.jsx";
import Token from "./Tokens/Token.jsx";
import getWinningLine from "../utils/getWinningLine.js";

import tvBg from "./Graphics/board_bg.PNG";
import shineOverlay from "./Graphics/overlay.PNG";

import x1 from "./Graphics/tokens/x1.PNG";
import x2 from "./Graphics/tokens/x2.PNG";
import x3 from "./Graphics/tokens/x3.PNG";
import x4 from "./Graphics/tokens/x4.PNG";
import x5 from "./Graphics/tokens/x5.PNG";

import o1 from "./Graphics/tokens/o1.PNG";
import o2 from "./Graphics/tokens/o2.PNG";
import o3 from "./Graphics/tokens/o3.PNG";
import o4 from "./Graphics/tokens/o4.PNG";
import o5 from "./Graphics/tokens/o5.PNG";

const X_FRAMES = [x1, x2, x3, x4, x5];
const O_FRAMES = [o1, o2, o3, o4, o5];

const GRID_GROUP_ID = "shape-573f3699-be59-8001-8006-9f6abe0e40f0";
const SVG_WIDTH_UNITS = 2048;

const TOKEN_ANIM_MS = 500;
const STALEMATE_DELAY_MS = 2000;
const GRID_FADE_IN_DELAY_MS = 2000;
const BLINK_MS = 800;
const BLINK_CYCLES = 5;

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gridRect, setGridRect] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [reversing, setReversing] = useState(false);
  const [winBlinking, setWinBlinking] = useState(false);

  const [statusMessage, setStatusMessage] = useState("GAME START!");
  const [statusBlink, setStatusBlink] = useState(true);

  const svgRef = useRef(null);
  const timeoutsRef = useRef([]);

  useLayoutEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const selector = `#${GRID_GROUP_ID} rect`;
    const rectNode = svgEl.querySelector(selector);
    if (rectNode && typeof rectNode.getBBox === "function") {
      const b = rectNode.getBBox();
      setGridRect({ x: b.x, y: b.y, w: b.width, h: b.height });
    }
  }, []);

  // Fade in grid only once, on first mount
  useEffect(() => {
    setOverlayVisible(false);
    const t = setTimeout(() => {
      setOverlayVisible(true);
      const startBlinkDuration = BLINK_MS * 2;
      const tStart = setTimeout(() => {
        setStatusBlink(false);
        setStatusMessage(`Player ${xIsNext ? "X" : "O"}'s Turn`);
      }, startBlinkDuration);
      timeoutsRef.current.push(tStart);
    }, GRID_FADE_IN_DELAY_MS);
    timeoutsRef.current.push(t);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setWinningLine(getWinningLine(squares));
  }, [squares]);

  // Stalemate handling
  useEffect(() => {
    const filled = squares.every((v) => v !== null);
    const stalemate = filled && !winningLine;
    if (!stalemate || reversing || winBlinking) return;

    setStatusMessage("STALEMATE :((((");
    setStatusBlink(true);

    const t1 = setTimeout(() => {
      setReversing(true);
      setTimeout(() => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
        setWinningLine(null);
        setReversing(false);
        setWinBlinking(false);
        setStatusMessage(`Player ${xIsNext ? "X" : "O"}'s Turn`);
        setStatusBlink(false);
      }, TOKEN_ANIM_MS);
    }, STALEMATE_DELAY_MS);

    timeoutsRef.current.push(t1);
    return () => clearTimeout(t1);
  }, [squares, winningLine, reversing, winBlinking]);

  // Win handling
  useEffect(() => {
    if (!winningLine) return;
    if (reversing) return;

    const winner = squares[winningLine[0]];
    setStatusMessage(`Player ${winner} Wins!`);
    setStatusBlink(true);

    setWinBlinking(true);

    const totalBlinkMs = BLINK_MS * BLINK_CYCLES;
    const tBlinkEnd = setTimeout(() => {
      setWinBlinking(false);
      setReversing(true);
      setTimeout(() => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
        setWinningLine(null);
        setReversing(false);
        setWinBlinking(false);
        setStatusMessage(`Player ${xIsNext ? "X" : "O"}'s Turn`);
        setStatusBlink(false);
      }, TOKEN_ANIM_MS);
    }, totalBlinkMs);

    timeoutsRef.current.push(tBlinkEnd);
    return () => clearTimeout(tBlinkEnd);
  }, [winningLine, reversing, squares, xIsNext]);

  // Update status on turn changes — don't overwrite game over messages
  useEffect(() => {
    const filled = squares.every((v) => v !== null);
    const stalemate = filled && !winningLine;
    if (stalemate || winningLine) return;
    if (reversing || winBlinking) return;
    setStatusMessage(`Player ${xIsNext ? "X" : "O"}'s Turn`);
    setStatusBlink(false);
  }, [xIsNext, squares, winningLine, reversing, winBlinking]);

  useEffect(() => () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; }, []);

  const onCellClick = (i) => {
    if (squares[i]) return;
    if (winningLine) return;
    if (reversing || winBlinking) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  const WRAP_PX = 500;

  const getFrames = (symbol) => {
    if (winBlinking) {
      return symbol === "X" ? X_FRAMES : O_FRAMES;
    }
    if (reversing) {
      return symbol === "X" ? [...X_FRAMES].reverse() : [...O_FRAMES].reverse();
    }
    return symbol === "X" ? X_FRAMES : O_FRAMES;
  };

  return (
    <div style={{ width: WRAP_PX, margin: "0 auto", position: "relative" }}>
      {/* STATUS MESSAGE — adjust `top` and `left` here to move text position */}
      {overlayVisible && (
        <div
          style={{
            fontFamily: "'Jersey 25', sans-serif",
            fontSize: "25px",
            color: "#fbc1d0",
            textAlign: "center",
            position: "absolute",
            top: "440px", // <-- change this value to move text vertically
            left: "50%", // <-- change this value to move text horizontally
            transform: "translateX(-50%)",
            width: "100%",
            animation: statusBlink ? "token-blink 0.8s step-end infinite" : "none",
            pointerEvents: "none",
            zIndex: 5
          }}
        >
          {statusMessage}
        </div>
      )}

      <img src={tvBg} alt="TV" style={{ width: "100%", display: "block" }} />

      {gridRect ? (
        (() => {
          const leftPx = Math.round((gridRect.x / SVG_WIDTH_UNITS) * WRAP_PX);
          const topPx = Math.round((gridRect.y / SVG_WIDTH_UNITS) * WRAP_PX);
          const wPx = Math.round((gridRect.w / SVG_WIDTH_UNITS) * WRAP_PX);
          const hPx = Math.round((gridRect.h / SVG_WIDTH_UNITS) * WRAP_PX);

          const cellW = Math.floor(wPx / 3);
          const cellH = Math.floor(hPx / 3);
          const overlayW = cellW * 3;
          const overlayH = cellH * 3;

          return (
            <div
              style={{
                position: "absolute",
                left: `${leftPx}px`,
                top: `${topPx}px`,
                width: `${overlayW}px`,
                height: `${overlayH}px`,
                outline: "none",
                opacity: overlayVisible ? 1 : 0,
                transition: "opacity 600ms ease",
              }}
            >
              <svg
                viewBox={`0 0 ${overlayW} ${overlayH}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              >
                <line x1={cellW} y1={0} x2={cellW} y2={overlayH} stroke="white" strokeWidth={5} />
                <line x1={cellW * 2} y1={0} x2={cellW * 2} y2={overlayH} stroke="white" strokeWidth={5} />
                <line x1={0} y1={cellH} x2={overlayW} y2={cellH} stroke="white" strokeWidth={5} />
                <line x1={0} y1={cellH * 2} x2={overlayW} y2={cellH * 2} stroke="white" strokeWidth={5} />
              </svg>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  gridTemplateColumns: `repeat(3, ${cellW}px)`,
                  gridTemplateRows: `repeat(3, ${cellH}px)`,
                }}
              >
                {squares.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => onCellClick(i)}
                    style={{
                      position: "relative",
                      background: "none",
                      border: "none",
                      padding: 0,
                      margin: 0,
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    aria-label={`Cell ${i}`}
                  >
                    {v && (
                      <Token
                        frames={getFrames(v)}
                        durationMs={TOKEN_ANIM_MS}
                        blink={winningLine?.includes(i) && winBlinking}
                        hideAtEnd={reversing}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })()
      ) : (
        <div
          style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#999", fontSize: 12 }}
        >
          <span>Measuring layout… (check console logs)</span>
        </div>
      )}

      <img
        src={shineOverlay}
        alt="Shine"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
      />

      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <LayoutSVG ref={svgRef} />
      </div>
      <a
  href="https://github.com/PatchesPaints/CRT-TTT"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: "block",
    marginTop: "12px",
    textAlign: "center",
    color: "#7e4a70",
    textDecoration: "none",
    fontFamily: "'Jersey 25', sans-serif",
    fontSize: "15px",
  }}
>
  Here's the Github Repo
</a>

    </div>
  );
}
