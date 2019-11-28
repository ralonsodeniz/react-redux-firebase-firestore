import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectShowModal } from "../../redux/modal/selectors";
import {
  selectUserAuthIsEmpty,
  selectUserAuthIsLoaded,
  selectUserEmailVerified
} from "../../redux/user/selectors";

import Counter from "../counter/counter";
import VideoInput from "../video-input/video-input";
import InnerModal from "../modal/inner-modal";
import Modal from "../modal/modal";
import SignInSignUpContainer from "../signin-signup-container/signin-signup-container";
import User from "../user/user";
import Spinner from "../spinner/spinner";

import { GlobalStyles } from "../../global.styles";
import { AppContainer, AppLogo } from "./App.styles";

const selectAppData = createStructuredSelector({
  showModal: selectShowModal,
  userAuthIsLoaded: selectUserAuthIsLoaded,
  userAuthIsEmpty: selectUserAuthIsEmpty,
  userEmailVerified: selectUserEmailVerified
});

const App = () => {
  const appData = useSelector(selectAppData, shallowEqual);
  const {
    showModal,
    userAuthIsEmpty,
    userAuthIsLoaded,
    userEmailVerified
  } = appData;
  // this is replaced by state.firebase.auth
  // useEffect(() => {
  //   dispatch(checkUserSessionStart());
  // }, [dispatch]);

  return userAuthIsLoaded ? (
    <AppContainer>
      <GlobalStyles />
      <header>
        <AppLogo />
      </header>
      {!userAuthIsEmpty && userEmailVerified ? (
        <section>
          <User />
          <Counter />
          <VideoInput />
        </section>
      ) : (
        <section>
          <SignInSignUpContainer />
        </section>
      )}
      {showModal && (
        <Modal>
          <InnerModal />
        </Modal>
      )}
    </AppContainer>
  ) : (
    <AppContainer>
      <GlobalStyles />
      <Spinner />
    </AppContainer>
  );
};

export default App;
