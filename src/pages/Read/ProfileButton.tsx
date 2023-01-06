import { Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import { User } from 'phosphor-react';

export const ButtonWrapper = styled(Link)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, max-content);
  grid-gap: 8px;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  color: #000;
  font-family: var(--sans-serif);
  border: 1px solid #000;
  border-radius: 4px;
  padding: 4px 8px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ProfileButton = () => (
  <ButtonWrapper to="/profile">
    <span>Profile</span>
    <User />
  </ButtonWrapper>
);

export default ProfileButton;
