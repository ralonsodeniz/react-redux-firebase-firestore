import React from "react";
import { Link } from "react-router-dom";

import SigninSignOutHeader from "./signin-signout-header";

import { HeaderContainer, HeaderLogo } from "./header.styles";

const Header = () => {
  return (
    <HeaderContainer>
      <Link to="/">
        <HeaderLogo />
      </Link>
      <SigninSignOutHeader />
    </HeaderContainer>
  );
};

export default Header;
