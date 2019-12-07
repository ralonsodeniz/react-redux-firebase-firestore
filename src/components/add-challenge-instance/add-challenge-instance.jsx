import React, { useState, useCallback } from "react";
import { createStructuredSelector } from "reselect";
import { useSelector, shallowEqual } from "react-redux";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import {
  selectUserAcceptedFriends,
  selectUserProfileDisplayName,
  selectUserProfileId
} from "../../redux/user/selectors";
import { addNewInstanceStart } from "../../redux/firestore/challenges-instances/actions";

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
  const [validateYourself, setValidateYourself] = useState(undefined);
  const {
    userAcceptedFriends,
    userProfileDisplayName,
    userProfileId
  } = useSelector(selectAddChallengeInstanceData, shallowEqual);

  const contendersOptions = userAcceptedFriends.map((friend, friendIndex) => ({
    text: friend.displayName,
    value: friend.uid,
    key: friendIndex + 1
  }));

  const validatorOptions = [
    ...contendersOptions,
    {
      text: userProfileDisplayName,
      value: userProfileId,
      key: 0
    }
  ];

  const handleValidateContenders = useCallback(
    () => setContendersValidated(true),
    []
  );
  const setSelfValidation = useCallback(() => setValidateYourself(true), []);
  const unsetSelfValidation = useCallback(() => setValidateYourself(false), []);

  const handleChange = useCallback(
    event => {
      const { name, selectedOptions } = event.target;
      // selectedOptions is an HTMLCollection so we create a function to iterate it and get the data we need
      const getValuesFromSelectedOptions = selectedOptions => {
        let arrayOfValues = [];
        for (let option of selectedOptions)
          arrayOfValues.push({ id: option.value, name: option.text });
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
        addNewInstanceStart(
          challengeTemplate,
          formInstanceChallengeData,
          userProfileDisplayName,
          userProfileId
        )
      );
    },
    [
      challengeTemplate,
      formInstanceChallengeData,
      userProfileDisplayName,
      userProfileId,
      dispatch
    ]
  );

  return (
    <AddChallengeInstanceContainer>
      <AddChallengeInstanceFormContainer
        onSubmit={handleCreateNewChallengeInstance}
      >
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
            />
            <CustomButton
              type="button"
              text="Validate contenders"
              onClick={handleValidateContenders}
            />
          </div>
        ) : formInstanceChallengeData.contenders.length > 0 &&
          validateYourself === undefined ? (
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
            />

            <CustomButton type="submit" text="Start challenge!" />
          </div>
        ) : (
          <CustomButton type="submit" text="Start challenge!" />
        )}
      </AddChallengeInstanceFormContainer>
    </AddChallengeInstanceContainer>
  );
};

AddChallengeInstance.propTypes = {
  challengeTemplate: PropTypes.object.isRequired
};

export default AddChallengeInstance;
