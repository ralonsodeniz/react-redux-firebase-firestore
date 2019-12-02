import React, { useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import { addNewChallengeStart } from "../../redux/firestore/challenges-templates/actions";
import { selectUserProfileDisplayName } from "../../redux/user/selectors";

import FormInput from "../form-input/form-input";
import FormDropdown from "../form-dropdown/form-dropdown";
import FileUploader from "../file-uplader/file-uploader";
import CustomButton from "../custom-button/custom-button";

import { AddChallengeContainer } from "./add-challenge.styles";
import { openModal } from "../../redux/modal/actions";

const selectAddChallengeData = createStructuredSelector({
  userProfileDisplayName: selectUserProfileDisplayName
});

const AddChallenge = () => {
  const dispatch = useDispatch();
  const addChallengeData = useSelector(selectAddChallengeData, shallowEqual);
  const { userProfileDisplayName } = addChallengeData;
  const [formChallengeData, setFormChallengeData] = useState({
    category: "",
    description: "",
    difficulty: "",
    minimunParticipants: "",
    name: "",
    daysToComplete: ""
  });
  const [formValidated, setFormValidated] = useState(false);
  const options = [
    {
      value: "ability",
      text: "Ability",
      key: 0
    },
    {
      value: "foodie",
      text: "Foodie",
      key: 1
    }
  ];
  const {
    category,
    description,
    difficulty,
    minimunParticipants,
    name,
    daysToComplete
  } = formChallengeData;
  const handleChange = useCallback(
    event => {
      const { value, name } = event.target;
      setFormChallengeData({
        ...formChallengeData,
        [name]: value
      });
    },
    [formChallengeData]
  );
  const handleFormCheck = event => {
    event.preventDefault();
    if (Object.values(formChallengeData).includes(""))
      return dispatch(
        openModal({
          modalType: "SYSTEM_MESSAGE",
          modalProps: { text: "Please select a category" }
        })
      );
    setFormValidated(true);
    dispatch(
      openModal({
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: "Form validated, choose challenge video and submit"
        }
      })
    );
  };
  // we use curried functions to pass first the arguments from the component and then return a function that awaits the url to dispatch the action when the file is updated and we have the video url
  // doing like this we do not have external dependencies
  const handleSubmit = useCallback(
    (dispatch, formChallengeData, userProfileDisplayName) => url => {
      const challengeData = {
        ...formChallengeData,
        author: userProfileDisplayName,
        videoUrl: url
      };
      dispatch(addNewChallengeStart(challengeData));
      setFormChallengeData({
        category: "",
        description: "",
        difficulty: "",
        minimunParticipants: "",
        name: "",
        daysToComplete: ""
      });
      setFormValidated(false);
    },
    []
  );

  return (
    <AddChallengeContainer>
      <form onSubmit={handleFormCheck}>
        <FormInput
          type="text"
          id="name"
          name="name"
          value={name}
          handleChange={handleChange}
          label="Challenge name"
          required
          disabled={formValidated}
        />
        <FormDropdown
          type="text"
          id="category"
          name="category"
          handleChange={handleChange}
          label="Category"
          options={options}
          required
          disabled={formValidated}
        />
        <FormInput
          type="text"
          id="description"
          name="description"
          value={description}
          handleChange={handleChange}
          label="Description"
          required
          disabled={formValidated}
        />
        <FormInput
          type="text"
          id="difficulty"
          name="difficulty"
          value={difficulty}
          handleChange={handleChange}
          label="Difficulty"
          required
          disabled={formValidated}
        />
        <FormInput
          type="number"
          id="minimunParticipants"
          name="minimunParticipants"
          value={minimunParticipants}
          handleChange={handleChange}
          label="Minimun participants"
          required
          disabled={formValidated}
        />

        <FormInput
          type="number"
          id="daysToComplete"
          name="daysToComplete"
          value={daysToComplete}
          handleChange={handleChange}
          label="Days to complete the challenge"
          required
          disabled={formValidated}
        />
        <CustomButton
          type="submit"
          text="Validate challenge info"
          disabled={formValidated}
        />
      </form>
      <FileUploader
        fileType="video"
        directory={`challengesTemplates/${category}/${name}`}
        fileName={name}
        // in this case, since we are returning a function, because handleSubmit is a curried function and we only pass the first set of parameters, we do not need to () => handleSubmit(dispatch, formChallengeData, userProfileDisplayName)
        // the function wont run until it is called in the children
        urlAction={handleSubmit(
          dispatch,
          formChallengeData,
          userProfileDisplayName
        )}
        labelText={"Choose challenge video"}
        submitText="Submit new challenge!"
        disabled={!formValidated}
      />
    </AddChallengeContainer>
  );
};

export default AddChallenge;
