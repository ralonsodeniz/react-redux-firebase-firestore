import React from "react";
import { Link } from "react-router-dom";

import { HomeContainer } from "./home.styles";

const Home = () => {
  return (
    <HomeContainer>
      <Link to="/main/all">Go to Main</Link>
    </HomeContainer>
  );
};

export default Home;
