import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  delayRender,
  continueRender,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { SCENES, TOTAL_FRAMES, ENDING_LINE, DIP } from "./copy";
import { FONT_TITLE, PALETTE } from "./palette";
import { FONT_FACES } from "./fontFaces";
import { Scene } from "./components/Scene";
import { TitleScene } from "./components/TitleScene";

// 注入 @font-face（通过 staticFile 指向 public/fonts）
export const FontFaces: React.FC = () => {
  const css = FONT_FACES.map(
    (f) =>
      `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};` +
      `font-display:block;src:url("${staticFile("/fonts/" + f.file)}") format('truetype');}`
  ).join("\n");
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

// 片尾：致我们 —— 温柔地与世界相处
const EndingLine: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
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
          width: 74,
          height: 1,
          marginBottom: 44,
          background: "linear-gradient(90deg, transparent, #C9B896, transparent)",
          opacity: op * 0.9,
        }}
      />
      <div
        style={{
          opacity: op,
          color: PALETTE.ink,
          fontFamily: FONT_TITLE,
          fontSize: 52,
          letterSpacing: "0.28em",
          textAlign: "center",
          paddingLeft: 60,
          paddingRight: 60,
          textShadow: "0 3px 30px rgba(0,0,0,0.55)",
        }}
      >
        {ENDING_LINE}
      </div>
    </AbsoluteFill>
  );
};

export const SangVideo: React.FC = () => {
  // 等字体加载完再渲染，避免首帧字体缺失
  const [handle] = React.useState(() => delayRender());
  React.useEffect(() => {
    let cancelled = false;
    const wait = async () => {
      try {
        await (document as unknown as { fonts: { ready: Promise<unknown> } })
          .fonts.ready;
      } catch {
        // ignore
      }
      if (!cancelled) {
        continueRender(handle);
      }
    };
    wait();
    return () => {
      cancelled = true;
      continueRender(handle);
    };
  }, [handle]);

  const offsets = SCENES.map((_, i) =>
    SCENES.slice(0, i).reduce((a, s) => a + s.dur, 0)
  );
  const last = SCENES.length - 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#15181E" }}>
      <FontFaces />
      <Audio src={staticFile("/audio/bgm.wav")} volume={0.9} />

      {/* 片头 */}
      <Sequence from={0} durationInFrames={SCENES[0].dur}>
        <TitleScene img={SCENES[0].img} dur={SCENES[0].dur} />
      </Sequence>

      {/* 正文各场 */}
      {SCENES.slice(1).map((s, i) => {
        const idx = i + 1;
        const isLast = idx === last;
        return (
          <Sequence key={s.id} from={offsets[idx]} durationInFrames={s.dur}>
            <Scene
              scene={s}
              beatFade={isLast ? { from: s.dur - DIP - 30, to: s.dur - DIP } : undefined}
            />
          </Sequence>
        );
      })}

      {/* 片尾句（叠在最后一场的尾段） */}
      <Sequence
        from={offsets[last] + SCENES[last].dur - DIP - 70}
        durationInFrames={DIP + 70}
      >
        <EndingLine />
      </Sequence>
    </AbsoluteFill>
  );
};
