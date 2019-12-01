import React from "react";

import Counter from "../../components/counter/counter";
import VideoInput from "../../components/video-input/video-input";
import AddChallenge from "../../components/add-challenge/add-challenge";

import { PlaygroundContainer } from "./playground.styles";

const Playground = () => {
  return (
    <PlaygroundContainer>
      <Counter />
      <VideoInput />
      <AddChallenge />
    </PlaygroundContainer>
  );
};

export default Playground;
