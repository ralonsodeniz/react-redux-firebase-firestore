import styled from "styled-components";

export const ClippedImageContainerBorder = styled.div`
  height: 150px;
  width: 150px;
  background: black;
  clip-path: circle(62px);
  -webkit-clip-path: circle(62px);
  margin-bottom: 10px;
`;

export const ClippedImageContainer = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
  /* object postion allows us to move the object in the x y axis 50% 50% is centered */
  object-position: 50% 50%;
  margin-bottom: 10px;
  clip-path: circle(61px);
  -webkit-clip-path: circle(61px);
`;
