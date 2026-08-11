import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT_BODY } from "../palette";

// 单行文字的淡入 + 上浮
export const RiseText: React.FC<{
  text: string;
  start: number;
  size: number;
  color: string;
  weight?: number;
  letterSpacing?: string;
}> = ({ text, start, size, color, weight = 400, letterSpacing = "0.14em" }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(frame, [start, start + 16], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        opacity: op,
        transform: `translateY(${y}px)`,
        color,
        fontFamily: FONT_BODY,
        fontWeight: weight,
        fontSize: size,
        letterSpacing,
        lineHeight: 1.6,
        textAlign: "center",
        textShadow: "0 2px 26px rgba(0,0,0,0.5)",
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
};

// 一行主句 + 一行副句（副句延迟淡入，更小更淡）
export const Beat: React.FC<{
  main: string;
  sub?: string;
  start: number;
  exit?: { from: number; to: number };
}> = ({ main, sub, start, exit }) => {
  const frame = useCurrentFrame();
  const exitOp = exit
    ? interpolate(frame, [exit.from, exit.to], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 70,
        paddingRight: 70,
        opacity: exitOp,
      }}
    >
      <RiseText text={main} start={start} size={62} color="#EDE8DB" weight={600} />
      {sub ? <div style={{ height: 24 }} /> : null}
      {sub ? (
        <RiseText
          text={sub}
          start={start + 18}
          size={38}
          color="#AEB6C2"
          weight={300}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// 章节小标（顶部）
export const Chapter: React.FC<{ text: string; start: number }> = ({
  text,
  start,
}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginTop: 160,
          opacity: op * 0.62,
          display: "flex",
          alignItems: "center",
          gap: 22,
          color: "#B8C0CC",
          fontFamily: FONT_BODY,
          fontSize: 24,
          fontWeight: 300,
          letterSpacing: "0.5em",
          textShadow: "0 2px 16px rgba(0,0,0,0.4)",
        }}
      >
        <span
          style={{
            width: 46,
            height: 1,
            background: "linear-gradient(90deg, transparent, #8FA3B8)",
          }}
        />
        {text}
        <span
          style={{
            width: 46,
            height: 1,
            background: "linear-gradient(90deg, #8FA3B8, transparent)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// 背景竖排虚字
export const GhostChar: React.FC<{ char: string; size?: number }> = ({
  char,
  size = 300,
}) => {
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          writingMode: "vertical-rl",
          marginRight: 34,
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: size,
          color: "rgba(160,176,196,0.05)",
          userSelect: "none",
        }}
      >
        {char}
      </div>
    </AbsoluteFill>
  );
};
