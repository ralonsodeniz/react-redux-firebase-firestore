import React from "react";
import { useParams } from "react-router-dom";

const TestParams = () => {
  let { category } = useParams();
  return <div>{category}</div>;
};

export default TestParams;
