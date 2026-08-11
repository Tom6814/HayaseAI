import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Scene as SceneDef } from "../copy";
import { DIP } from "../copy";
import { Fog, Grade, Grain, Rain } from "./Overlays";
import { Beat, Chapter, GhostChar } from "./TypeText";

// 单个场景：底图缓慢推移（Ken Burns）+ 淡入淡出黑场 + 字幕节奏
export const Scene: React.FC<{
  scene: SceneDef;
  beatFade?: { from: number; to: number };
}> = ({ scene, beatFade }) => {
  const frame = useCurrentFrame();
  const dur = scene.dur;

  // Ken Burns：慢推 + 微微上移
  const zoom = interpolate(frame, [0, dur], [1.02, 1.13], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shift = interpolate(frame, [0, dur], [0, -46], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 黑场淡入淡出（剪辑感：每场都从黑里长出来，又沉回黑里）
  const dipIn = interpolate(frame, [0, DIP], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dipOut = interpolate(frame, [dur - DIP, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dip = Math.max(dipIn, dipOut);

  // 字幕节奏：在场内均匀分布
  const beats = scene.beats;
  const visible = dur - DIP * 2 - 24;
  const beatStart = (i: number) =>
    DIP + 20 + Math.round((i * visible) / Math.max(beats.length, 1));

  return (
    <AbsoluteFill style={{ backgroundColor: "#15181E" }}>
      {/* 底图 */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(scene.img)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom}) translateY(${shift}px)`,
            filter: "saturate(0.62) contrast(1.06) brightness(0.88)",
          }}
        />
      </AbsoluteFill>

      {/* 蓝灰调色 + 暗角 */}
      <Grade />

      {/* 雨 / 雾 */}
      {scene.rain ? <Rain /> : null}
      {scene.fog ? <Fog /> : null}

      {/* 背景竖排虚字 */}
      <GhostChar char={scene.ghost} />

      {/* 章节 */}
      {scene.chapter ? <Chapter text={scene.chapter} start={DIP + 6} /> : null}

      {/* 字幕 */}
      {beats.map((b, i) => (
        <Beat key={i} main={b.main} sub={b.sub} start={beatStart(i)} exit={beatFade} />
      ))}

      {/* 颗粒 */}
      <Grain />

      {/* 黑场 */}
      {dip > 0 ? (
        <AbsoluteFill style={{ backgroundColor: "#0C0E13", opacity: dip }} />
      ) : null}
    </AbsoluteFill>
  );
};

// 供调试的每场起始帧
export const sceneOffsetOf = (index: number, scenes: SceneDef[]) =>
  scenes.slice(0, index).reduce((a, s) => a + s.dur, 0);
