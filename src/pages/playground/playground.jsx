import React from "react";

import { createRandomId, assignNewIdToItem } from "../../utils/utils";

import Counter from "../../components/counter/counter";
import VideoInput from "../../components/video-input/video-input";
import CustomButton from "../../components/custom-button/custom-button";

import { PlaygroundContainer } from "./playground.styles";

const Playground = () => {
  const testObj = {
    0: {
      sdgsa: 244,
      aafsda: 324235,
      gdsgd: "·34w4"
    },
    1: {
      432523: 34325,
      235235: "dsfsdag",
      dfsf34: "sfsd989"
    }
  };

  return (
    <PlaygroundContainer>
      <Counter />
      <VideoInput />
      <CustomButton
        text="radom id"
        onClick={() => {
          const randomId = assignNewIdToItem(testObj, createRandomId, 1);
          console.log(randomId);
        }}
      />
    </PlaygroundContainer>
  );
};

export default Playground;
