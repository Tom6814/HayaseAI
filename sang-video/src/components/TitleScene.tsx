import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TITLE_SUB, DIP } from "../copy";
import { PALETTE, FONT_TITLE } from "../palette";
import { Grade, Grain, Rain } from "./Overlays";

// 片头：竖排"丧"字虚影 + 大标题 + 一句引言
export const TitleScene: React.FC<{ img: string; dur: number }> = ({
  img,
  dur,
}) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, dur], [1.0, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dipIn = interpolate(frame, [0, DIP], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dipOut = interpolate(frame, [dur - DIP, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dip = Math.max(dipIn, dipOut);

  const fadeIn = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ backgroundColor: "#15181E" }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(img)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            filter: "saturate(0.55) contrast(1.05) brightness(0.8)",
          }}
        />
      </AbsoluteFill>
      <Grade />
      <Rain />

      {/* 巨型竖排虚字：丧 */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            fontFamily: FONT_TITLE,
            fontSize: 470,
            color: "rgba(175,190,208,0.05)",
            userSelect: "none",
          }}
        >
          丧
        </div>
      </AbsoluteFill>

      {/* 顶部小字 */}
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
            marginTop: 168,
            opacity: fadeIn(DIP + 6, DIP + 24) * 0.66,
            color: PALETTE.inkDim,
            fontFamily: FONT_TITLE,
            fontSize: 28,
            letterSpacing: "0.5em",
            textShadow: "0 2px 18px rgba(0,0,0,0.5)",
          }}
        >
          一则写给「我们」的短片
        </div>
      </AbsoluteFill>

      {/* 标题 */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: FONT_TITLE,
            fontSize: 92,
            lineHeight: 1.45,
            letterSpacing: "0.18em",
            color: PALETTE.ink,
            textShadow: "0 4px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ opacity: fadeIn(DIP + 14, DIP + 40) }}>当代年轻人</div>
          <div style={{ opacity: fadeIn(DIP + 34, DIP + 62), marginTop: 10 }}>
            为什么都这么
            <span style={{ color: "#C9B896" }}>丧</span>
          </div>
        </div>
      </AbsoluteFill>

      {/* 引言 */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 230,
        }}
      >
        <div
          style={{
            opacity: fadeIn(DIP + 80, DIP + 104) * 0.85,
            color: PALETTE.inkDim,
            fontFamily: FONT_TITLE,
            fontSize: 32,
            letterSpacing: "0.3em",
            textAlign: "center",
            textShadow: "0 2px 20px rgba(0,0,0,0.55)",
          }}
        >
          {TITLE_SUB}
        </div>
      </AbsoluteFill>

      <Grain />
      {dip > 0 ? (
        <AbsoluteFill style={{ backgroundColor: "#0C0E13", opacity: dip }} />
      ) : null}
    </AbsoluteFill>
  );
};
