import React, { useState, useCallback, useMemo } from "react";
import { createStructuredSelector } from "reselect";
import { useSelector, shallowEqual } from "react-redux";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import {
  selectUserAcceptedFriends,
  selectUserProfileDisplayName,
  selectUserProfileId,
  selectUsersDisplayNamesById
} from "../../redux/user/selectors";
import { addNewInstanceStarts } from "../../redux/firestore/challenges-instances/actions";

import FormDropdown from "../form-dropdown/form-dropdown";
import CustomButton from "../custom-button/custom-button";

import {
  AddChallengeInstanceContainer,
  AddChallengeInstanceFormContainer
} from "./add-challenge-instance.styles";

const selectAddChallengeInstanceData = createStructuredSelector({
  userAcceptedFriends: selectUserAcceptedFriends,
  userProfileDisplayName: selectUserProfileDisplayName,
  userProfileId: selectUserProfileId
});

const AddChallengeInstance = ({ challengeTemplate }) => {
  const dispatch = useDispatch();

  const [formInstanceChallengeData, setFormInstanceChallengeData] = useState({
    contenders: [],
    validators: []
  });

  const [contendersValidated, setContendersValidated] = useState(false);

  const [validateYourself, setValidateYourself] = useState(false);

  const {
    userAcceptedFriends,
    userProfileDisplayName,
    userProfileId
  } = useSelector(selectAddChallengeInstanceData, shallowEqual);

  const memoizedSelectUsersDisplayNamesById = useMemo(
    () => selectUsersDisplayNamesById,
    []
  );

  const userAcceptedFriendsDisplayNames = useSelector(state =>
    memoizedSelectUsersDisplayNamesById(state, userAcceptedFriends)
  );

  const contendersOptions = userAcceptedFriends.map((friend, friendIndex) => ({
    text: userAcceptedFriendsDisplayNames[friendIndex],
    value: friend
  }));

  const validatorOptions =
    formInstanceChallengeData.contenders.length > 0
      ? [
          ...contendersOptions,
          {
            text: userProfileDisplayName,
            value: userProfileId
          }
        ]
      : contendersOptions;

  // const validatorOptions = [
  //   ...contendersOptions,
  //   {
  //     text: userProfileDisplayName,
  //     value: userProfileId,
  //     key: 0
  //   }
  // ];

  const handleValidateContenders = useCallback(
    () => setContendersValidated(true),
    []
  );
  const setSelfValidation = useCallback(() => setValidateYourself(true), []);

  const unsetSelfValidation = useCallback(() => {
    dispatch(
      addNewInstanceStarts(
        challengeTemplate,
        formInstanceChallengeData,
        userProfileId,
        validateYourself
      )
    );
  }, [
    challengeTemplate,
    dispatch,
    formInstanceChallengeData,
    userProfileId,
    validateYourself
  ]);

  const handleChange = useCallback(
    event => {
      const { name, selectedOptions } = event.target;
      // selectedOptions is an HTMLCollection so we create a function to iterate it and get the data we need
      const getValuesFromSelectedOptions = selectedOptions => {
        let arrayOfValues = [];
        for (let option of selectedOptions) arrayOfValues.push(option.value);
        return arrayOfValues;
      };
      const valueArray = getValuesFromSelectedOptions(selectedOptions);
      setFormInstanceChallengeData({
        ...formInstanceChallengeData,
        [name]: valueArray
      });
    },
    [formInstanceChallengeData]
  );

  const handleCreateNewChallengeInstance = useCallback(
    event => {
      event.preventDefault();
      dispatch(
        addNewInstanceStarts(
          challengeTemplate,
          formInstanceChallengeData,
          userProfileId,
          validateYourself
        )
      );
      setValidateYourself(false);
    },
    [
      challengeTemplate,
      formInstanceChallengeData,
      userProfileId,
      dispatch,
      validateYourself
    ]
  );

  return (
    <AddChallengeInstanceContainer>
      <AddChallengeInstanceFormContainer
        onSubmit={handleCreateNewChallengeInstance}
      >
        {/* {!contendersValidated && userAcceptedFriends.length > 0 ? ( */}
        {!contendersValidated ? (
          <div>
            <h4>Invite friends to compete in the challenge!</h4>
            <FormDropdown
              type="text"
              id="contenders"
              name="contenders"
              handleChange={handleChange}
              label="Contenders"
              options={contendersOptions}
              required
              multiple={true}
              size={4}
            />
            <CustomButton
              type="button"
              text="Validate contenders"
              onClick={handleValidateContenders}
            />
          </div>
        ) : //): validateYourself === undefined && userAcceptedFriends.length > 0 ? (
        validateYourself === false ? (
          <div>
            <h4>Do you want to validate yourself the challenge?</h4>
            <CustomButton
              text="Yes"
              type="button"
              onClick={setSelfValidation}
            />
            <CustomButton
              text="No"
              type="button"
              onClick={unsetSelfValidation}
            />
          </div>
        ) : validateYourself ? (
          <div>
            <FormDropdown
              type="text"
              id="validators"
              name="validators"
              handleChange={handleChange}
              label="Validators"
              options={validatorOptions}
              required
              multiple={true}
              size={3}
            />

            <CustomButton type="submit" text="Start challenge!" />
          </div>
        ) : (
          // <CustomButton type="submit" text="Start challenge!" />
          "Creating instance"
        )}
      </AddChallengeInstanceFormContainer>
    </AddChallengeInstanceContainer>
  );
};

AddChallengeInstance.propTypes = {
  challengeTemplate: PropTypes.object.isRequired
};

export default AddChallengeInstance;
