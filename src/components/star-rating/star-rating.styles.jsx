import styled from "styled-components";

export const StarContainer = styled.div`
  width: 2em;
  height: 2em;
  background-color: grey;
  -webkit-clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );

  ${({ selected, color }) =>
    selected ? `background-color: ${color}` : `background-color: grey`}

    ${({ interactive }) =>
    interactive ? `  cursor: pointer` : ``}
`;

export const StarRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StarsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;
