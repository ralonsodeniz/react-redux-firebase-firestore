import styled, { css } from "styled-components";

const UserDataStyles = css`
  display: flex;
  flex-direction: column;
`;

export const UserContainer = styled.div`
  width: 30vw;
  height: auto;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  margin: 20px auto 50px;
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UserAvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

export const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
`;

export const CircularProgressContainer = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
`;

export const UpdateAvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InputFileContainer = styled.input`
  border: 0;
  clip-path: rect(0, 0, 0, 0);
  height: 0.1px;
  width: 0.1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  opacity: 0;
`;

export const LabelFileContainer = styled.label`
  width: max-content;
  padding: 5px;
  text-align: center;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background-color: white;
  color: #807a7a;
  font-weight: 500;
  font-size: 13px;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  margin: 5px;

  &:active {
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.15);
  }
`;

export const LogOutButtonContainer = styled.div`
  align-self: flex-end;
`;

export const UserDataContainer = styled.div`
  display: grid;
  justify-content: space-evenly;
  width: 100%;
  grid-template: auto/auto;
  grid-template-areas:
    "displayName age"
    "gender country"
    "email email";
`;

export const DisplayNameContainer = styled.div`
  grid-area: displayName;
  ${UserDataStyles}
`;

export const AgeContainer = styled.div`
  grid-area: age;
  ${UserDataStyles}
`;

export const GenderContainer = styled.div`
  grid-area: gender;
  ${UserDataStyles}
`;

export const CountryContainer = styled.div`
  grid-area: country;
  ${UserDataStyles}
`;

export const EmailContainer = styled.div`
  grid-area: email;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const UserDataTextTitle = styled.h4`
  font-weight: 400;
`;

export const UserDataText = styled.span`
  font-weight: 100;
`;
