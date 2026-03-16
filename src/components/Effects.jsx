import {
  BrightnessContrast,
  EffectComposer,
} from "@react-three/postprocessing";
import React from "react";

const Effects = () => {
  return (
    <EffectComposer>
      <BrightnessContrast
        brightness={0}
        contrast={0}
      />
    </EffectComposer>
  );
};

export default Effects;
