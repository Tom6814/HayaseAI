import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../palette";

// ---------- 胶片颗粒 ----------
const GRAIN_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>`
  );

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity =
    0.05 + 0.025 * Math.sin(frame * 0.35) + 0.015 * Math.sin(frame * 0.13);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${GRAIN_SVG})`,
        backgroundSize: "240px 240px",
        opacity: Math.max(0.03, opacity),
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

// ---------- 雨丝（逐帧驱动，确定性） ----------
const DROPS = Array.from({ length: 42 }, (_, i) => {
  return {
    x: ((i * 137.508 + 61) % 1080) - 20,
    speed: 7 + (i % 6) * 1.6,
    len: 110 + ((i * 7) % 5) * 50,
    off: ((i * 983) % 2600),
    op: 0.1 + (i % 6) * 0.03,
    slant: ((i * 13) % 7) - 3,
  };
});

export const Rain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {DROPS.map((d, i) => {
        const y = ((frame * d.speed + d.off) % 2700) - 400;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: y,
              width: 1.4,
              height: d.len,
              borderRadius: 1,
              background: `linear-gradient(180deg, rgba(205,218,232,0), rgba(205,218,232,${d.op}))`,
              transform: `rotate(${d.slant}deg)`,
              transformOrigin: "top left",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 雾气（缓慢漂移） ----------
export const Fog: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [0, 140]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -400 + drift,
          top: 500,
          width: 1400,
          height: 560,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(200,212,226,0.16), rgba(200,212,226,0))",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -500 - drift * 0.6,
          top: 1150,
          width: 1500,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(170,186,205,0.13), rgba(170,186,205,0))",
          filter: "blur(70px)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- 蓝灰调色 + 暗角 ----------
export const Grade: React.FC = () => {
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(18,21,28,0.50) 0%, rgba(18,21,28,0.10) 34%, rgba(18,21,28,0.18) 58%, rgba(12,14,19,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 62% at 50% 42%, rgba(255,255,255,0) 55%, rgba(10,12,17,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${PALETTE.accentSoft}18, ${PALETTE.bgDeep}00 40%, ${PALETTE.bgDeep}44)`,
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />
    </>
  );
};
