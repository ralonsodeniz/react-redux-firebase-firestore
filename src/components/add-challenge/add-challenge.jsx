import React, { useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import { addNewChallengeStarts } from "../../redux/firestore/challenges-templates/actions";
import { selectUserProfileId } from "../../redux/user/selectors";

import FormInput from "../form-input/form-input";
// import FormDropdown from "../form-dropdown/form-dropdown";
import FileUploader from "../file-uplader/file-uploader";
import CustomButton from "../custom-button/custom-button";

import {
  AddChallengeContainer,
  AddChallengeValidationContainer
} from "./add-challenge.styles";
// import { openModal } from "../../redux/modal/actions";

const selectAddChallengeData = createStructuredSelector({
  userProfileId: selectUserProfileId
});

const AddChallenge = ({ urlCategory }) => {
  const dispatch = useDispatch();

  const addChallengeData = useSelector(selectAddChallengeData, shallowEqual);

  const { userProfileId } = addChallengeData;

  const [formChallengeData, setFormChallengeData] = useState({
    description: "",
    // difficulty: "",
    minimumParticipants: "",
    name: ""
    // daysToComplete: ""
  });

  const [formValidated, setFormValidated] = useState(false);
  // no logner needed since we are passing category from the selected in the url
  // const options = [
  //   {
  //     value: "ability",
  //     text: "Ability",
  //     key: 0
  //   },
  //   {
  //     value: "foodie",
  //     text: "Foodie",
  //     key: 1
  //   }
  // ];

  const {
    description,
    // difficulty,
    minimumParticipants,
    name
    // daysToComplete
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
    // we no longer need to check if the category is selected
    // if (Object.values(formChallengeData).includes(""))
    //   return dispatch(
    //     openModal({
    //       modalType: "SYSTEM_MESSAGE",
    //       modalProps: { text: "Please select a category" }
    //     })
    //   );
    setFormValidated(true);
  };
  // we use curried functions to pass first the arguments from the component and then return a function that awaits the url to dispatch the action when the file is updated and we have the video url
  // doing like this we do not have external dependencies

  const handleSubmit = useCallback(
    (dispatch, formChallengeData, userProfileId, urlCategory) => url => {
      const challengeData = {
        ...formChallengeData,
        author: userProfileId,
        category: urlCategory,
        videoUrl: url
      };
      dispatch(addNewChallengeStarts(challengeData));
      setFormChallengeData({
        description: "",
        // difficulty: "",
        minimumParticipants: "",
        name: ""
        // daysToComplete: ""
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
        {/* <FormDropdown
          type="text"
          id="category"
          name="category"
          handleChange={handleChange}
          label="Category"
          options={options}
          required
          disabled={formValidated}
        /> */}
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
        {/* <FormInput
          type="text"
          id="difficulty"
          name="difficulty"
          value={difficulty}
          handleChange={handleChange}
          label="Difficulty"
          required
          disabled={formValidated}
        /> */}
        <FormInput
          type="number"
          id="minimumParticipants"
          name="minimumParticipants"
          value={minimumParticipants}
          handleChange={handleChange}
          label="Minimun participants"
          required
          disabled={formValidated}
        />

        {/* <FormInput
          type="number"
          id="daysToComplete"
          name="daysToComplete"
          value={daysToComplete}
          handleChange={handleChange}
          label="Days to complete the challenge"
          required
          disabled={formValidated}
        /> */}
        <AddChallengeValidationContainer></AddChallengeValidationContainer>
        <CustomButton
          type="submit"
          text="Validate challenge info"
          disabled={formValidated}
        />
        {!formValidated ? <span>&#9744;</span> : <span>&#9745;</span>}
      </form>
      <FileUploader
        fileType="video"
        directory={`challengesTemplates/${urlCategory}/${name}`}
        fileName={name}
        // in this case, since we are returning a function, because handleSubmit is a curried function and we only pass the first set of parameters, we do not need to () => handleSubmit(dispatch, formChallengeData, userProfileId)
        // the function wont run until it is called in the children
        urlAction={handleSubmit(
          dispatch,
          formChallengeData,
          userProfileId,
          urlCategory
        )}
        labelText={"Choose challenge video"}
        submitText="Submit new challenge!"
        disabled={!formValidated}
        maxFileSizeInMB={50}
      />
    </AddChallengeContainer>
  );
};

AddChallenge.propTypes = {
  urlCategory: PropTypes.string.isRequired
};

export default AddChallenge;
