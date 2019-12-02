import React from "react";

import Counter from "../../components/counter/counter";
import VideoInput from "../../components/video-input/video-input";

import { PlaygroundContainer } from "./playground.styles";

const Playground = () => {
  return (
    <PlaygroundContainer>
      <Counter />
      <VideoInput />
    </PlaygroundContainer>
  );
};

export default Playground;
