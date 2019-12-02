import React, { Suspense, lazy } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Switch, Route, Redirect } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";

import { selectShowModal } from "../../redux/modal/selectors";
import {
  selectUserAuthIsEmpty,
  selectUserAuthIsLoaded,
  selectUserEmailVerified
} from "../../redux/user/selectors";

import InnerModal from "../modal/inner-modal";
import Modal from "../modal/modal";
import Spinner from "../spinner/spinner";
import ErrorBoundary from "../error-boundary/error-boundary";
import Header from "../header/header";

import { GlobalStyles } from "../../global.styles";
import { AppContainer } from "./App.styles";

const Home = lazy(() => import("../../pages/home/home"));
const MainPage = lazy(() => import("../../pages/main/main"));
const AccountPage = lazy(() => import("../../pages/account/account"));
const SigninPage = lazy(() => import("../../pages/signin/signin"));
const SignupPage = lazy(() => import("../../pages/signup/signup"));
const Playground = lazy(() => import("../../pages/playground/playground"));

const selectAppData = createStructuredSelector({
  showModal: selectShowModal,
  userAuthIsLoaded: selectUserAuthIsLoaded,
  userAuthIsEmpty: selectUserAuthIsEmpty,
  userEmailVerified: selectUserEmailVerified
});

const App = () => {
  const appData = useSelector(selectAppData, shallowEqual);
  const { showModal, userAuthIsEmpty, userAuthIsLoaded } = appData;
  // this is replaced by state.firebase.auth
  // useEffect(() => {
  //   dispatch(checkUserSessionStart());
  // }, [dispatch]);
  useFirestoreConnect([
    { collection: `users` },
    { collection: `challengesTemplates` }
  ]);

  return (
    <AppContainer>
      {console.log("APP RENDER")}
      <GlobalStyles />
      <header>
        <Header />
      </header>
      <ErrorBoundary>
        <Switch>
          <Suspense fallback={<Spinner />}>
            <Route exact path="/" component={Home} />
            <Route path="/main" component={MainPage} />
            <Route
              exact
              path="/signin"
              render={() =>
                userAuthIsLoaded && !userAuthIsEmpty ? (
                  <Redirect to="/" />
                ) : (
                  <SigninPage />
                )
              }
            />
            <Route
              exact
              path="/signup"
              render={() =>
                userAuthIsLoaded && !userAuthIsEmpty ? (
                  <Redirect to="/" />
                ) : (
                  <SignupPage />
                )
              }
            />
            <Route
              exact
              path="/account"
              render={() =>
                userAuthIsLoaded && userAuthIsEmpty ? (
                  <Redirect to="/signin" />
                ) : (
                  <AccountPage />
                )
              }
            />
            <Route
              exact
              path="/playground"
              render={() =>
                userAuthIsLoaded && userAuthIsEmpty ? (
                  <Redirect to="/signin" />
                ) : (
                  <Playground />
                )
              }
            />
          </Suspense>
        </Switch>
      </ErrorBoundary>
      {showModal && (
        <Modal>
          <InnerModal />
        </Modal>
      )}
    </AppContainer>
  );
};

export default App;
