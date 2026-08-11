import React from "react";
import { Composition } from "remotion";
import { SangVideo } from "./SangVideo";
import { TOTAL_FRAMES, FPS } from "./copy";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SangVideo"
      component={SangVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
