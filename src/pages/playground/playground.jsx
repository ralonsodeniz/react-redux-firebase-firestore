import React from "react";
import { useDispatch } from "react-redux";

import { openModal } from "../../redux/modal/actions";

import Counter from "../../components/counter/counter";
import VideoInput from "../../components/video-input/video-input";
import CustomButton from "../../components/custom-button/custom-button";
import AddChallenge from "../../components/add-challenge/add-challenge";

import { PlaygroundContainer } from "./playground.styles";

const Playground = () => {
  const dispatch = useDispatch();
  return (
    <PlaygroundContainer>
      <Counter />
      <VideoInput />
      <CustomButton
        type="button"
        text="Propose a new challenge"
        onClick={() =>
          dispatch(
            openModal({
              modalType: "ADD_CHALLENGE",
              modalProps: {}
            })
          )
        }
      />
    </PlaygroundContainer>
  );
};

export default Playground;
