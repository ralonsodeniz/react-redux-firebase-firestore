import styled from "styled-components";

export const ClippedImageContainerBorder = styled.div`
  height: 150px;
  width: 150px;
  background: black;
  clip-path: circle(72px);
  -webkit-clip-path: circle(72px);
`;

export const ClippedImageContainer = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
  /* object postion allows us to move the object in the x y axis 50% 50% is centered */
  object-position: 50% 50%;
  clip-path: circle(71px);
  -webkit-clip-path: circle(71px);
`;
