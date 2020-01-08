import React from "react";
import { Link } from "react-router-dom";

import SigninSignOutHeader from "./signin-signout-header";
import HeaderStatistics from "./header-statistics";

import { HeaderContainer, HeaderLogo } from "./header.styles";

const Header = () => {
  return (
    <HeaderContainer>
      <Link to="/">
        <HeaderLogo />
      </Link>
      <HeaderStatistics />
      <SigninSignOutHeader />
    </HeaderContainer>
  );
};

export default Header;
