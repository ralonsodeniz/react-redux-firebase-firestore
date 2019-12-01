import React, { useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import { addNewChallengeStart } from "../../redux/firestore/challenges-templates/actions";
import { selectUserProfileDisplayName } from "../../redux/user/selectors";

import FormInput from "../form-input/form-input";
import FormDropdown from "../form-dropdown/form-dropdown";
import FileUploader from "../file-uplader/file-uploader";

import { AddChallengeContainer } from "./add-challenge.styles";

const selectAddChallengeData = createStructuredSelector({
  userProfileDisplayName: selectUserProfileDisplayName
});

const AddChallenge = () => {
  const dispatch = useDispatch();
  const addChallengeData = useSelector(selectAddChallengeData, shallowEqual);
  const { userProfileDisplayName } = addChallengeData;
  const [formChallengeData, setFormChallengeData] = useState({
    author: "",
    category: "ability",
    description: "",
    difficulty: "",
    minimunParticipants: "",
    name: "",
    timeToComplete: ""
  });
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
    timeToComplete
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
  const handleSubmit = useCallback(
    url => {
      const challengeData = {
        ...formChallengeData,
        author: userProfileDisplayName,
        videoUrl: url
      };
      dispatch(addNewChallengeStart(challengeData));
      setFormChallengeData({
        author: "",
        category: "ability",
        description: "",
        difficulty: "",
        minimunParticipants: "",
        name: "",
        timeToComplete: ""
      });
    },
    [dispatch, formChallengeData, userProfileDisplayName]
  );

  return (
    <AddChallengeContainer>
      <form>
        <FormDropdown
          type="text"
          id="category"
          name="category"
          handleChange={handleChange}
          label="Category"
          options={options}
          defaultValue="ability"
          required
        />
        <FormInput
          type="text"
          id="description"
          name="description"
          value={description}
          handleChange={handleChange}
          label="Description"
          required
        />
        <FormInput
          type="text"
          id="difficulty"
          name="difficulty"
          value={difficulty}
          handleChange={handleChange}
          label="Difficulty"
          required
        />
        <FormInput
          type="number"
          id="minimunParticipants"
          name="minimunParticipants"
          value={minimunParticipants}
          handleChange={handleChange}
          label="Minimun participants"
          required
        />
        <FormInput
          type="text"
          id="name"
          name="name"
          value={name}
          handleChange={handleChange}
          label="Challenge name"
          required
        />
        <FormInput
          type="number"
          id="timeToComplete"
          name="timeToComplete"
          value={timeToComplete}
          handleChange={handleChange}
          label="Time to complete"
          required
        />
        <FileUploader
          fileType="video"
          directory={`challengesTemplates/${category}/${name}`}
          fileName={name}
          urlAction={handleSubmit}
          labelText={"Choose challenge video"}
          submitText="Submit new challenge!"
        />
      </form>
    </AddChallengeContainer>
  );
};

export default AddChallenge;
